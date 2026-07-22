import { Injectable, signal, computed } from '@angular/core';
import { OfflineAudioService } from './offline-audio';
import { Verse } from '../models/verse.model';

export interface PlayingSourate {
  id: number;
  numero: number;
  nomFrancais: string;
}

const BITRATES = [128, 64, 48, 32];

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audioElement: HTMLAudioElement = new Audio();
  private currentObjectUrl: string | null = null;
  private playToken = 0;

  sourate = signal<PlayingSourate | null>(null);
  verses = signal<Verse[]>([]);
  reciterIdentifier = signal<string>('ar.alafasy');
  reciterNom = signal<string>('Alafasy');
  currentVerseIndex = signal<number>(-1);
  isPlaying = signal(false);

  currentVerse = computed(() => {
    const idx = this.currentVerseIndex();
    const list = this.verses();
    return idx >= 0 && idx < list.length ? list[idx] : null;
  });

  progress = computed(() => {
    const total = this.verses().length;
    if (total === 0) return 0;
    return ((this.currentVerseIndex() + 1) / total) * 100;
  });

  constructor(private offlineAudio: OfflineAudioService) {
    this.audioElement.addEventListener('ended', () => this.next());
  }

  start(sourate: PlayingSourate, verses: Verse[], reciterIdentifier: string, reciterNom: string, startIndex: number = 0): void {
    this.sourate.set(sourate);
    this.verses.set(verses);
    this.reciterIdentifier.set(reciterIdentifier);
    this.reciterNom.set(reciterNom);
    this.playFromIndex(startIndex);
  }

  changeReciter(identifier: string, nom: string): void {
    const wasPlaying = this.isPlaying();
    const idx = this.currentVerseIndex() === -1 ? 0 : this.currentVerseIndex();

    this.reciterIdentifier.set(identifier);
    this.reciterNom.set(nom);

    if (wasPlaying) {
      this.playFromIndex(idx);
    }
  }

  toggle(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      const idx = this.currentVerseIndex() === -1 ? 0 : this.currentVerseIndex();
      this.playFromIndex(idx);
    }
  }

  playIndex(index: number): void {
    this.playFromIndex(index);
  }

  next(): void {
    if (this.isPlaying()) {
      this.playFromIndex(this.currentVerseIndex() + 1);
    }
  }

  private testAudioUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const testAudio = new Audio();
      let settled = false;

      const cleanup = () => {
        testAudio.removeEventListener('canplay', onSuccess);
        testAudio.removeEventListener('error', onError);
        testAudio.src = '';
      };

      const onSuccess = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(true);
      };

      const onError = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(false);
      };

      testAudio.addEventListener('canplay', onSuccess);
      testAudio.addEventListener('error', onError);

      setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(false);
      }, 4000);

      testAudio.src = url;
      testAudio.load();
    });
  }

  private async resolvePlayableUrl(numeroGlobal: number): Promise<string> {
    const identifier = this.reciterIdentifier();

    for (const bitrate of BITRATES) {
      const url = `https://cdn.islamic.network/quran/audio/${bitrate}/${identifier}/${numeroGlobal}.mp3`;
      const works = await this.testAudioUrl(url);
      if (works) return url;
    }

    return `https://cdn.islamic.network/quran/audio/128/${identifier}/${numeroGlobal}.mp3`;
  }

  private async playFromIndex(index: number): Promise<void> {
    const list = this.verses();
    if (index >= list.length) {
      this.isPlaying.set(false);
      this.currentVerseIndex.set(-1);
      return;
    }

    const token = ++this.playToken;

    this.currentVerseIndex.set(index);
    this.isPlaying.set(true);

    const verse = list[index];
    const url = await this.resolvePlayableUrl(verse.numero_global);

    if (token !== this.playToken) return;

    let source: string;
    try {
      source = await this.offlineAudio.getAudioSource(url);
    } catch {
      source = url;
    }

    if (token !== this.playToken) return;

    if (this.currentObjectUrl) {
      URL.revokeObjectURL(this.currentObjectUrl);
      this.currentObjectUrl = null;
    }
    if (source.startsWith('blob:')) {
      this.currentObjectUrl = source;
    }

    this.audioElement.pause();
    this.audioElement.src = source;
    this.audioElement.load();

    try {
      await this.audioElement.play();
    } catch {
      if (token === this.playToken) {
        this.isPlaying.set(false);
      }
    }
  }

  pause(): void {
    this.audioElement.pause();
    this.isPlaying.set(false);
  }

  stop(): void {
    this.audioElement.pause();
    this.audioElement.src = '';
    this.isPlaying.set(false);
    this.currentVerseIndex.set(-1);
    this.sourate.set(null);
    this.verses.set([]);
  }

  currentAudioUrls(): string[] {
    return this.verses().map(v => `https://cdn.islamic.network/quran/audio/128/${this.reciterIdentifier()}/${v.numero_global}.mp3`);
  }
}
