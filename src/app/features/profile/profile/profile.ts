import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth';
import { FavoriService } from '../../../core/services/favori';
import { OfflineAudioService } from '../../../core/services/offline-audio';
import { LanguageService, AppLanguage } from '../../../core/services/language';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);
  private favoriService = inject(FavoriService);
  offlineAudio = inject(OfflineAudioService);
  languageService = inject(LanguageService);
  private router = inject(Router);

  favorisCount = computed(() => this.favoriService.getAllSourateIds().length);
  downloadsCount = computed(() => this.offlineAudio.registry().length);

  initials = computed(() => {
    const name = this.authService.currentUser()?.name ?? '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  constructor() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.authService.currentUser()) {
      this.authService.fetchCurrentUser().subscribe({
        error: () => this.router.navigate(['/login']),
      });
    }
  }

  setLanguage(lang: AppLanguage): void {
    this.languageService.setLanguage(lang);
  }
}
