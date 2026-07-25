import { Component, inject, OnInit } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { PrayerTimesService } from '../../../core/services/prayer-times';
import { PrayerNotificationsService } from '../../../core/services/prayer-notifications';
import { LanguageService } from '../../../core/services/language';

const METHODS = [
  { id: 2, labelKey: 'HORAIRES.METHOD_MWL' },
  { id: 3, labelKey: 'HORAIRES.METHOD_UMM_AL_QURA' },
  { id: 5, labelKey: 'HORAIRES.METHOD_EGYPT' },
  { id: 4, labelKey: 'HORAIRES.METHOD_UMM_AL_QURA_VAR' },
  { id: 1, labelKey: 'HORAIRES.METHOD_KARACHI' },
];

@Component({
  selector: 'app-horaires-prieres',
  imports: [TranslatePipe],
  templateUrl: './horaires-prieres.html',
  styleUrl: './horaires-prieres.scss',
})
export class HorairesPrieres implements OnInit {
  prayerTimesService = inject(PrayerTimesService);
  notifService = inject(PrayerNotificationsService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

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
    this.languageService.currentLang();
    const unitMin = this.translate.instant('HORAIRES.UNIT_MIN');
    const unitHour = this.translate.instant('HORAIRES.UNIT_HOUR');
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} ${unitMin}`;
    return `${h} ${unitHour} ${m} ${unitMin}`;
  }
}
