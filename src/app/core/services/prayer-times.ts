import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

export interface PrayerTime {
  name: string;
  label: string;
  time: string; // "HH:mm"
}

interface AladhanResponse {
  data: {
    timings: Record<string, string>;
    date: { readable: string; gregorian: { date: string } };
  };
}

const PRAYER_KEYS: { key: string; label: string }[] = [
  { key: 'Fajr', label: 'Fajr' },
  { key: 'Sunrise', label: 'Shurouq' },
  { key: 'Dhuhr', label: 'Dhuhr' },
  { key: 'Asr', label: 'Asr' },
  { key: 'Maghrib', label: 'Maghrib' },
  { key: 'Isha', label: 'Isha' },
];

@Injectable({ providedIn: 'root' })
export class PrayerTimesService {
  private http = inject(HttpClient);

  loading = signal(true);
  error = signal<string | null>(null);
  locationLabel = signal<string>('');
  prayerTimes = signal<PrayerTime[]>([]);
  calculationMethod = signal<number>(2); // 2 = Muslim World League

  now = signal<Date>(new Date());

  constructor() {
    setInterval(() => this.now.set(new Date()), 30_000);
  }

  nextPrayer = computed<{ prayer: PrayerTime; minutesLeft: number } | null>(() => {
    const times = this.prayerTimes().filter(p => p.name !== 'Sunrise');
    if (times.length === 0) return null;

    const nowDate = this.now();
    const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();

    for (const p of times) {
      const [h, m] = p.time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > nowMinutes) {
        return { prayer: p, minutesLeft: prayerMinutes - nowMinutes };
      }
    }
    // Toutes les prières du jour sont passées → la prochaine est Fajr demain
    const fajr = times[0];
    const [h, m] = fajr.time.split(':').map(Number);
    const minutesUntilMidnight = 24 * 60 - nowMinutes;
    return { prayer: fajr, minutesLeft: minutesUntilMidnight + h * 60 + m };
  });

  currentPrayer = computed<PrayerTime | null>(() => {
    const times = this.prayerTimes().filter(p => p.name !== 'Sunrise');
    if (times.length === 0) return null;

    const nowDate = this.now();
    const nowMinutes = nowDate.getHours() * 60 + nowDate.getMinutes();

    let current: PrayerTime | null = null;
    for (const p of times) {
      const [h, m] = p.time.split(':').map(Number);
      if (h * 60 + m <= nowMinutes) {
        current = p;
      }
    }
    return current ?? times[times.length - 1];
  });

  requestLocationAndLoad(): void {
    this.loading.set(true);
    this.error.set(null);

    if (!navigator.geolocation) {
      this.error.set("La géolocalisation n'est pas supportée par ce navigateur.");
      this.loading.set(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.fetchTimings(latitude, longitude);
        this.reverseGeocode(latitude, longitude);
      },
      () => {
        this.error.set("Impossible d'accéder à ta position. Autorise la géolocalisation pour voir les horaires de prière.");
        this.loading.set(false);
      }
    );
  }

  setCalculationMethod(method: number): void {
    this.calculationMethod.set(method);
    this.requestLocationAndLoad();
  }

  private fetchTimings(lat: number, lng: number): void {
    const today = this.formatDate(new Date());
    const url = `https://api.aladhan.com/v1/timings/${today}?latitude=${lat}&longitude=${lng}&method=${this.calculationMethod()}`;

    this.http.get<AladhanResponse>(url).pipe(
      catchError(() => {
        this.error.set("Impossible de récupérer les horaires de prière pour le moment.");
        this.loading.set(false);
        return of(null);
      })
    ).subscribe(res => {
      if (!res) return;
      const timings = res.data.timings;
      const times: PrayerTime[] = PRAYER_KEYS.map(p => ({
        name: p.key,
        label: p.label,
        time: timings[p.key]?.split(' ')[0] ?? '--:--',
      }));
      this.prayerTimes.set(times);
      this.loading.set(false);
    });
  }

  private reverseGeocode(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`;
    this.http.get<any>(url).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (!res) return;
      const address = res.address ?? {};
      const city = address.city ?? address.town ?? address.village ?? address.county ?? '';
      const country = address.country ?? '';
      this.locationLabel.set([city, country].filter(Boolean).join(', '));
    });
  }

  private formatDate(d: Date): string {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}-${month}-${d.getFullYear()}`;
  }
}
