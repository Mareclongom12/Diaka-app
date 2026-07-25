import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PrayerTimesService } from '../../../core/services/prayer-times';
import { LanguageService } from '../../../core/services/language';
import { QuranTextService } from '../../../core/services/quran-text';
import { SourateService } from '../../../core/services/sourate';

const MOTIVATIONS_COUNT = 10;

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  prayerTimesService = inject(PrayerTimesService);
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);
  private quranTextService = inject(QuranTextService);
  private sourateService = inject(SourateService);

  verseLoading = signal(true);
  verseArabe = signal<string>('');
  verseFrancais = signal<string>('');
  verseSourateNom = signal<string>('');
  verseNumero = signal<number>(0);
  verseSourateId = signal<number>(0);

  todayMotivation = computed<string>(() => {
    this.languageService.currentLang();
    const dayOfYear = this.getDayOfYear();
    const key = (dayOfYear % MOTIVATIONS_COUNT) + 1;
    return this.translate.instant(`DASHBOARD_MOTIVATIONS.${key}`);
  });

  ngOnInit(): void {
    this.prayerTimesService.requestLocationAndLoad();
    this.loadVerseOfDay();
  }

  private getDayOfYear(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private loadVerseOfDay(): void {
    const seed = this.getDayOfYear();
    const sourateNumero = (seed % 114) + 1;

    this.sourateService.getAll().subscribe(sourates => {
      const sourate = sourates.find(s => s.numero === sourateNumero);
      if (!sourate) {
        this.verseLoading.set(false);
        return;
      }
      this.verseSourateNom.set(sourate.nom_francais);
      this.verseSourateId.set(sourate.id);

      this.quranTextService.getVerses(sourateNumero).subscribe({
        next: (verses) => {
          if (verses.length === 0) {
            this.verseLoading.set(false);
            return;
          }
          const verseIndex = seed % verses.length;
          const verse = verses[verseIndex];
          this.verseArabe.set(verse.arabe);
          this.verseFrancais.set(verse.francais);
          this.verseNumero.set(verse.numero);
          this.verseLoading.set(false);
        },
        error: () => this.verseLoading.set(false),
      });
    });
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
