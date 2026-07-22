import { Injectable, signal, computed, effect } from '@angular/core';

export interface DhikrPhrase {
  id: string;
  arabe: string;
  translitteration: string;
  traduction: string;
}

export const DHIKR_PHRASES: DhikrPhrase[] = [
  { id: 'subhanallah', arabe: 'سُبْحَانَ اللَّهِ', translitteration: 'SubhanAllah', traduction: 'Gloire à Allah' },
  { id: 'alhamdulillah', arabe: 'الْحَمْدُ لِلَّهِ', translitteration: 'Alhamdulillah', traduction: 'Louange à Allah' },
  { id: 'allahuakbar', arabe: 'اللَّهُ أَكْبَرُ', translitteration: 'Allahu Akbar', traduction: 'Allah est le Plus Grand' },
  { id: 'lailahaillallah', arabe: 'لَا إِلَٰهَ إِلَّا اللَّهُ', translitteration: 'La ilaha illa Allah', traduction: "Il n'y a de divinité qu'Allah" },
  { id: 'astaghfirullah', arabe: 'أَسْتَغْفِرُ اللَّهَ', translitteration: 'Astaghfirullah', traduction: "Je demande pardon à Allah" },
  { id: 'lahawla', arabe: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', translitteration: 'La hawla wa la quwwata illa billah', traduction: "Il n'y a de force ni de puissance qu'en Allah" },
  { id: 'salawat', arabe: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', translitteration: 'Allahumma salli ala Muhammad', traduction: 'Prière sur le Prophète ﷺ' },
];

const TARGETS_STORAGE_KEY = 'dhikr_targets';
const TOTALS_STORAGE_KEY = 'dhikr_totals';

@Injectable({ providedIn: 'root' })
export class DhikrService {
  phrases = DHIKR_PHRASES;

  selectedPhraseId = signal<string>(this.phrases[0].id);
  count = signal<number>(0);
  target = signal<number>(33);

  private totals = signal<Record<string, number>>(this.loadTotals());

  selectedPhrase = computed<DhikrPhrase>(() =>
    this.phrases.find(p => p.id === this.selectedPhraseId()) ?? this.phrases[0]
  );

  progress = computed<number>(() => {
    const t = this.target();
    if (t <= 0) return 0;
    return Math.min(100, (this.count() / t) * 100);
  });

  isTargetReached = computed<boolean>(() => this.count() >= this.target() && this.target() > 0);

  totalForSelected = computed<number>(() => this.totals()[this.selectedPhraseId()] ?? 0);

  increment(): void {
    this.count.update(c => c + 1);
    this.totals.update(t => ({
      ...t,
      [this.selectedPhraseId()]: (t[this.selectedPhraseId()] ?? 0) + 1,
    }));
    this.saveTotals();

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(this.isTargetReached() && this.count() === this.target() ? [40, 30, 40] : 15);
    }
  }

  resetSession(): void {
    this.count.set(0);
  }

  resetTotalForSelected(): void {
    this.totals.update(t => {
      const copy = { ...t };
      delete copy[this.selectedPhraseId()];
      return copy;
    });
    this.saveTotals();
  }

  selectPhrase(id: string): void {
    this.selectedPhraseId.set(id);
    this.count.set(0);
  }

  setTarget(target: number): void {
    this.target.set(target);
    this.count.set(0);
  }

  private loadTotals(): Record<string, number> {
    try {
      const raw = localStorage.getItem(TOTALS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveTotals(): void {
    localStorage.setItem(TOTALS_STORAGE_KEY, JSON.stringify(this.totals()));
  }
}
