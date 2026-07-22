import { Component, input, effect } from '@angular/core';
import { AudioPlayerService } from '../../core/services/audio-player';
import { Audio } from '../../core/models/audio.model';

@Component({
  selector: 'app-audio-player',
  imports: [],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.scss',
})
export class AudioPlayer {
  audio = input.required<Audio>();

  constructor(public player: AudioPlayerService) {
    effect(() => {
      // Charge automatiquement l'audio dès qu'il change, sans le jouer
    });
  }

  togglePlay(): void {
    const current = this.audio();
    if (this.player.currentAudio()?.id === current.id) {
      this.player.toggle();
    } else {
      this.player.play(current);
    }
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.player.seek(Number(input.value));
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  isCurrentlyPlaying(): boolean {
    return this.player.currentAudio()?.id === this.audio().id && this.player.isPlaying();
  }
}
