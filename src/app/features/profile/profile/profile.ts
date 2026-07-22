import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { FavoriService } from '../../../core/services/favori';
import { OfflineAudioService } from '../../../core/services/offline-audio';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);
  private favoriService = inject(FavoriService);
  offlineAudio = inject(OfflineAudioService);

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
    if (!this.authService.currentUser()) {
      this.authService.fetchCurrentUser().subscribe();
    }
  }
}
