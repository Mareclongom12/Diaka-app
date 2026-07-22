import { Injectable, signal, computed } from '@angular/core';
import { Audio as AudioModel } from '../models/audio.model';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audioElement: HTMLAudioElement = new globalThis.Audio();

  currentAudio = signal<AudioModel | null>(null);
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);

  progress = computed(() => {
    const dur = this.duration();
    return dur > 0 ? (this.currentTime() / dur) * 100 : 0;
  });

  constructor() {
    this.audioElement.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audioElement.currentTime);
    });
    this.audioElement.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audioElement.duration);
    });
    this.audioElement.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });
  }

  play(audio: AudioModel): void {
    if (this.currentAudio()?.id !== audio.id) {
      this.audioElement.src = audio.url;
      this.currentAudio.set(audio);
    }
    this.audioElement.play();
    this.isPlaying.set(true);
  }

  pause(): void {
    this.audioElement.pause();
    this.isPlaying.set(false);
  }

  toggle(): void {
    if (this.isPlaying()) {
      this.pause();
    } else if (this.currentAudio()) {
      this.audioElement.play();
      this.isPlaying.set(true);
    }
  }

  seek(percentage: number): void {
    const dur = this.duration();
    if (dur > 0) {
      this.audioElement.currentTime = (percentage / 100) * dur;
    }
  }

  stop(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.isPlaying.set(false);
    this.currentAudio.set(null);
  }
}
