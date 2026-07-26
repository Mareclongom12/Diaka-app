import { Injectable, inject, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language';

export interface WuduStep {
  id: number;
  title: string;
  description: string;
  repetitions: number | null;
  icon: 'niyyah' | 'hands' | 'mouth' | 'nose' | 'face' | 'arms' | 'head' | 'ears' | 'feet' | 'dua';
}

const STEPS_META: { id: number; key: string; repetitions: number | null; icon: WuduStep['icon'] }[] = [
  { id: 1, key: '1', repetitions: null, icon: 'niyyah' },
  { id: 2, key: '2', repetitions: null, icon: 'niyyah' },
  { id: 3, key: '3', repetitions: 3, icon: 'hands' },
  { id: 4, key: '4', repetitions: 3, icon: 'mouth' },
  { id: 5, key: '5', repetitions: 3, icon: 'nose' },
  { id: 6, key: '6', repetitions: 3, icon: 'face' },
  { id: 7, key: '7', repetitions: 3, icon: 'arms' },
  { id: 8, key: '8', repetitions: 1, icon: 'head' },
  { id: 9, key: '9', repetitions: 1, icon: 'ears' },
  { id: 10, key: '10', repetitions: 3, icon: 'feet' },
  { id: 11, key: '11', repetitions: null, icon: 'dua' },
];

@Injectable({ providedIn: 'root' })
export class WuduService {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  steps = computed<WuduStep[]>(() => {
    this.languageService.currentLang();
    const t = this.translate.instant('WUDU_STEPS');
    return STEPS_META.map(s => ({
      id: s.id,
      title: t[s.key].title,
      description: t[s.key].desc,
      repetitions: s.repetitions,
      icon: s.icon,
    }));
  });

  duaFinale = computed(() => {
    this.languageService.currentLang();
    const t = this.translate.instant('WUDU_DUA');
    return {
      arabe: 'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      translitteration: t.translit,
      traduction: t.trad,
    };
  });
}
