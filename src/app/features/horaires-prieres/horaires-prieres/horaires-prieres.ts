import { Component, inject, OnInit } from '@angular/core';
import { PrayerTimesService } from '../../../core/services/prayer-times';
import { PrayerNotificationsService } from '../../../core/services/prayer-notifications';

const METHODS = [
  { id: 2, label: 'Ligue Islamique Mondiale' },
  { id: 3, label: 'Umm al-Qura (Mecque)' },
  { id: 5, label: 'Égypte' },
  { id: 4, label: 'Umm al-Qura (variante)' },
  { id: 1, label: 'Karachi' },
];

@Component({
  selector: 'app-horaires-prieres',
  imports: [],
  templateUrl: './horaires-prieres.html',
  styleUrl: './horaires-prieres.scss',
})
export class HorairesPrieres implements OnInit {
  prayerTimesService = inject(PrayerTimesService);
  notifService = inject(PrayerNotificationsService);

  methods = METHODS;

  ngOnInit(): void {
    this.prayerTimesService.requestLocationAndLoad();
  }

  retry(): void {
    this.prayerTimesService.requestLocationAndLoad();
  }

  onMethodChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.prayerTimesService.setCalculationMethod(value);
  }

  toggleNotifications(): void {
    if (this.notifService.enabled()) {
      this.notifService.disable();
    } else {
      this.notifService.enable();
    }
  }

  formatMinutesLeft(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} min`;
    return `${h} h ${m} min`;
  }
}
