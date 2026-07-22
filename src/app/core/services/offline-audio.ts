import { Injectable, signal } from '@angular/core';

const CACHE_NAME = 'diaka-audio-cache-v1';
const REGISTRY_KEY = 'diaka_downloads_registry';

export interface DownloadedSourate {
  sourateId: number;
  sourateNumero: number;
  nomFrancais: string;
  reciterIdentifier: string;
  reciterNom: string;
  urls: string[];
}

@Injectable({
  providedIn: 'root'
})
export class OfflineAudioService {
  downloadedUrls = signal<Set<string>>(new Set());
  downloadingUrl = signal<string | null>(null);
  downloadProgress = signal<number>(0);
  registry = signal<DownloadedSourate[]>(this.loadRegistry());

  constructor() {
    this.refreshDownloadedList();
  }

  private loadRegistry(): DownloadedSourate[] {
    try {
      const raw = localStorage.getItem(REGISTRY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveRegistry(list: DownloadedSourate[]): void {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(list));
    this.registry.set(list);
  }

  private async refreshDownloadedList(): Promise<void> {
    if (!('caches' in window)) return;
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    this.downloadedUrls.set(new Set(keys.map(req => req.url)));
  }

  isDownloaded(url: string): boolean {
    return this.downloadedUrls().has(url);
  }

  isSourateFullyDownloaded(urls: string[]): boolean {
    return urls.length > 0 && urls.every(url => this.isDownloaded(url));
  }

  async downloadSourate(entry: DownloadedSourate): Promise<void> {
    if (!('caches' in window)) return;

    const cache = await caches.open(CACHE_NAME);
    let done = 0;

    for (const url of entry.urls) {
      this.downloadingUrl.set(url);
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch {
        // Verset ignoré si le téléchargement échoue
      }
      done++;
      this.downloadProgress.set(Math.round((done / entry.urls.length) * 100));
    }

    this.downloadingUrl.set(null);
    this.downloadProgress.set(0);
    await this.refreshDownloadedList();

    const current = this.registry().filter(
      d => !(d.sourateId === entry.sourateId && d.reciterIdentifier === entry.reciterIdentifier)
    );
    this.saveRegistry([...current, entry]);
  }

  async getAudioSource(url: string): Promise<string> {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(url);
      if (cached) {
        const blob = await cached.blob();
        return URL.createObjectURL(blob);
      }
    }
    return url;
  }

  async deleteSourate(sourateId: number, reciterIdentifier: string): Promise<void> {
    const entry = this.registry().find(
      d => d.sourateId === sourateId && d.reciterIdentifier === reciterIdentifier
    );
    if (!entry) return;

    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      for (const url of entry.urls) {
        await cache.delete(url);
      }
    }

    await this.refreshDownloadedList();
    this.saveRegistry(this.registry().filter(
      d => !(d.sourateId === sourateId && d.reciterIdentifier === reciterIdentifier)
    ));
  }
}
