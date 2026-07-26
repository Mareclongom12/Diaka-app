import { Injectable, inject, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language';

export interface HijriDate {
  year: number;
  month: number;
  day: number;
}

export interface CalendarDay {
  gregorianDate: Date;
  hijriDay: number;
  isToday: boolean;
}

export interface ImportantDate {
  name: string;
  hijriMonth: number;
  hijriDay: number;
  description: string;
  gregorianDate: Date;
}

const EVENTS_META = [
  { key: '1', month: 1, day: 1 },
  { key: '2', month: 1, day: 10 },
  { key: '3', month: 3, day: 12 },
  { key: '4', month: 9, day: 1 },
  { key: '5', month: 9, day: 27 },
  { key: '6', month: 10, day: 1 },
  { key: '7', month: 12, day: 9 },
  { key: '8', month: 12, day: 10 },
];

@Injectable({ providedIn: 'root' })
export class HijriService {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  monthNames = computed<string[]>(() => {
    this.languageService.currentLang();
    const names = this.translate.instant('HIJRI_MONTHS');
    return Array.from({ length: 12 }, (_, i) => names[String(i + 1)]);
  });

  private gregorianToJD(y: number, m: number, d: number): number {
    const a = Math.floor((14 - m) / 12);
    const y2 = y + 4800 - a;
    const m2 = m + 12 * a - 3;
    return d + Math.floor((153 * m2 + 2) / 5) + 365 * y2 + Math.floor(y2 / 4) - Math.floor(y2 / 100) + Math.floor(y2 / 400) - 32045;
  }

  private jdToGregorian(jd: number): Date {
    const a = jd + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);
    return new Date(year, month - 1, day);
  }

  private islamicToJD(y: number, m: number, d: number): number {
    return d + Math.ceil(29.5 * (m - 1)) + (y - 1) * 354 + Math.floor((3 + 11 * y) / 30) + 1948440 - 1;
  }

  private jdToIslamic(jdInput: number): HijriDate {
    const jd = Math.floor(jdInput) + 0.5;
    const year = Math.floor((30 * (jd - 1948440) + 10646) / 10631);
    const prevJD = this.islamicToJD(year, 1, 1);
    let month = Math.min(12, Math.ceil((jd - 29 - prevJD) / 29.5) + 1);
    if (month < 1) month = 1;
    const day = jd - this.islamicToJD(year, month, 1) + 1;
    return { year, month, day };
  }

  gregorianToHijri(date: Date): HijriDate {
    const jd = this.gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
    return this.jdToIslamic(jd);
  }

  hijriToGregorian(year: number, month: number, day: number): Date {
    const jd = this.islamicToJD(year, month, day);
    return this.jdToGregorian(jd);
  }

  private daysInHijriMonth(year: number, month: number): number {
    const thisMonthStart = this.islamicToJD(year, month, 1);
    let nextYear = year, nextMonth = month + 1;
    if (nextMonth > 12) { nextMonth = 1; nextYear = year + 1; }
    const nextMonthStart = this.islamicToJD(nextYear, nextMonth, 1);
    return nextMonthStart - thisMonthStart;
  }

  getMonthGrid(hijriYear: number, hijriMonth: number): CalendarDay[] {
    const daysCount = this.daysInHijriMonth(hijriYear, hijriMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: CalendarDay[] = [];
    for (let d = 1; d <= daysCount; d++) {
      const gDate = this.hijriToGregorian(hijriYear, hijriMonth, d);
      gDate.setHours(0, 0, 0, 0);
      days.push({
        gregorianDate: gDate,
        hijriDay: d,
        isToday: gDate.getTime() === today.getTime(),
      });
    }
    return days;
  }

  getImportantDates(hijriYear: number): ImportantDate[] {
    const events = this.translate.instant('HIJRI_EVENTS');
    return EVENTS_META.map(e => ({
      name: events[e.key].name,
      hijriMonth: e.month,
      hijriDay: e.day,
      description: events[e.key].desc,
      gregorianDate: this.hijriToGregorian(hijriYear, e.month, e.day),
    }));
  }
}
