import { Injectable, inject, signal, effect } from '@angular/core';
import { PrayerTimesService } from './prayer-times';

const NOTIF_STORAGE_KEY = 'prayer_notifications_enabled';

@Injectable({ providedIn: 'root' })
export class PrayerNotificationsService {
  private prayerTimesService = inject(PrayerTimesService);

  enabled = signal<boolean>(localStorage.getItem(NOTIF_STORAGE_KEY) === 'true');
  permission = signal<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  private notifiedToday = new Set<string>();
  private lastCheckDate = new Date().toDateString();

  constructor() {
    setInterval(() => this.checkAndNotify(), 20_000);
  }

  async requestPermission(): Promise<void> {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    this.permission.set(result);
    if (result === 'granted') {
      this.enabled.set(true);
      localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
    }
  }

  disable(): void {
    this.enabled.set(false);
    localStorage.setItem(NOTIF_STORAGE_KEY, 'false');
  }

  enable(): void {
    if (this.permission() === 'granted') {
      this.enabled.set(true);
      localStorage.setItem(NOTIF_STORAGE_KEY, 'true');
    } else {
      this.requestPermission();
    }
  }

  private checkAndNotify(): void {
    if (!this.enabled() || this.permission() !== 'granted') return;

    const today = new Date().toDateString();
    if (today !== this.lastCheckDate) {
      this.notifiedToday.clear();
      this.lastCheckDate = today;
    }

    const times = this.prayerTimesService.prayerTimes().filter(p => p.name !== 'Sunrise');
    if (times.length === 0) return;

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (const p of times) {
      const [h, m] = p.time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      const key = `${today}-${p.name}`;

      if (Math.abs(prayerMinutes - nowMinutes) <= 1 && !this.notifiedToday.has(key)) {
        this.notifiedToday.add(key);
        this.sendNotification(p.label, p.time);
      }
    }
  }

  private sendNotification(label: string, time: string): void {
    new Notification(`Heure de ${label}`, {
      body: `C'est l'heure de la prière ${label} (${time}).`,
      icon: '/favicon.ico',
    });
  }
}
