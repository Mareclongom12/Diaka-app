import { Injectable } from '@angular/core';

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

const HIJRI_MONTH_NAMES = [
  'Mouharram', 'Safar', 'Rabi al-Awwal', 'Rabi ath-Thani',
  "Joumada al-Oula", 'Joumada ath-Thania', 'Rajab', 'Chaabane',
  'Ramadan', 'Chawwal', "Dhou al-Qi'da", 'Dhou al-Hijja',
];

@Injectable({ providedIn: 'root' })
export class HijriService {
  monthNames = HIJRI_MONTH_NAMES;

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
    const events: { name: string; month: number; day: number; description: string }[] = [
      { name: 'Nouvel An Hijri', month: 1, day: 1, description: "Début de l'année hijri (Mouharram)" },
      { name: 'Achoura', month: 1, day: 10, description: 'Jour de jeûne recommandé' },
      { name: 'Mawlid an-Nabawi', month: 3, day: 12, description: 'Naissance du Prophète ﷺ' },
      { name: 'Début du Ramadan', month: 9, day: 1, description: 'Début du mois de jeûne' },
      { name: "Nuit d'Al-Qadr (approx.)", month: 9, day: 27, description: 'Nuit du Destin (10 dernières nuits)' },
      { name: 'Aïd al-Fitr', month: 10, day: 1, description: 'Fête de la rupture du jeûne' },
      { name: "Journée d'Arafat", month: 12, day: 9, description: "Veille de l'Aïd al-Adha" },
      { name: 'Aïd al-Adha', month: 12, day: 10, description: 'Fête du sacrifice' },
    ];

    return events.map(e => ({
      name: e.name,
      hijriMonth: e.month,
      hijriDay: e.day,
      description: e.description,
      gregorianDate: this.hijriToGregorian(hijriYear, e.month, e.day),
    }));
  }
}
