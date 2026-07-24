import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { LanguageService } from './core/services/language';
import { AuthService } from './core/services/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimations(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
      lang: 'fr',
      fallbackLang: 'fr',
    }),
    provideAppInitializer(() => {
      const langService = inject(LanguageService);
      langService.init();
    }),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      if (authService.isLoggedIn()) {
        return firstValueFrom(authService.fetchCurrentUser()).catch(() => {
          authService.invalidateSession();
        });
      }
      return Promise.resolve();
    }),
  ]
};
