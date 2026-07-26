import { Component, inject, signal, computed } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HijriService, CalendarDay, ImportantDate } from '../../../core/services/hijri';
import { LanguageService } from '../../../core/services/language';

@Component({
  selector: 'app-calendrier',
  imports: [TranslatePipe],
  templateUrl: './calendrier.html',
  styleUrl: './calendrier.scss',
})
export class Calendrier {
  private hijriService = inject(HijriService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  private todayHijri = this.hijriService.gregorianToHijri(new Date());

  viewedYear = signal<number>(this.todayHijri.year);
  viewedMonth = signal<number>(this.todayHijri.month);

  monthName = computed(() => this.hijriService.monthNames()[this.viewedMonth() - 1]);
  days = computed<CalendarDay[]>(() => this.hijriService.getMonthGrid(this.viewedYear(), this.viewedMonth()));

  leadingBlanks = computed<number[]>(() => {
    const firstDay = this.days()[0];
    if (!firstDay) return [];
    const dow = firstDay.gregorianDate.getDay();
    return Array.from({ length: dow });
  });

  importantDates = computed<ImportantDate[]>(() => {
    this.languageService.currentLang();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const events = this.hijriService.getImportantDates(this.viewedYear());
    return events
      .filter(e => e.gregorianDate.getTime() >= today.getTime())
      .sort((a, b) => a.gregorianDate.getTime() - b.gregorianDate.getTime());
  });

  weekDays = computed<string[]>(() => {
    this.languageService.currentLang();
    return this.translate.instant('CALENDRIER.WEEKDAYS') as string[];
  });

  private locale = computed<string>(() => {
    this.languageService.currentLang();
    return this.translate.instant('CALENDRIER.LOCALE') as string;
  });

  previousMonth(): void {
    let m = this.viewedMonth() - 1;
    let y = this.viewedYear();
    if (m < 1) { m = 12; y--; }
    this.viewedMonth.set(m);
    this.viewedYear.set(y);
  }

  nextMonth(): void {
    let m = this.viewedMonth() + 1;
    let y = this.viewedYear();
    if (m > 12) { m = 1; y++; }
    this.viewedMonth.set(m);
    this.viewedYear.set(y);
  }

  goToToday(): void {
    this.viewedYear.set(this.todayHijri.year);
    this.viewedMonth.set(this.todayHijri.month);
  }

  formatShort(date: Date): string {
    return date.toLocaleDateString(this.locale(), { day: 'numeric', month: 'short' });
  }


  formatFull(date: Date): string {
    return date.toLocaleDateString(this.locale(), { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
