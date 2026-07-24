import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'fr' | 'en' | 'wo' | 'ar';

const LANGUAGE_STORAGE_KEY = 'app_language';
const RTL_LANGUAGES: AppLanguage[] = ['ar'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);

  currentLang = signal<AppLanguage>('fr');

  init(): void {
    const saved = (localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage) || 'fr';
    this.setLanguage(saved);
  }

  setLanguage(lang: AppLanguage): void {
    this.translate.use(lang);
    this.currentLang.set(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

    const isRtl = RTL_LANGUAGES.includes(lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
  }
}
