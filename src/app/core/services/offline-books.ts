import { Injectable, signal } from '@angular/core';

const CACHE_NAME = 'diaka-books-cache-v1';
const REGISTRY_KEY = 'diaka_books_downloads_registry';

export interface DownloadedBook {
  bookId: string;
  title: string;
  author: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineBooksService {
  downloadedUrls = signal<Set<string>>(new Set());
  downloadingId = signal<string | null>(null);
  downloadProgress = signal<number>(0);
  registry = signal<DownloadedBook[]>(this.loadRegistry());

  constructor() {
    this.refreshDownloadedList();
  }

  private loadRegistry(): DownloadedBook[] {
    try {
      const raw = localStorage.getItem(REGISTRY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveRegistry(list: DownloadedBook[]): void {
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

  async downloadBook(book: DownloadedBook): Promise<void> {
    if (!('caches' in window)) return;

    this.downloadingId.set(book.bookId);
    this.downloadProgress.set(0);

    try {
      const response = await fetch(book.url);
      if (!response.ok || !response.body) {
        throw new Error('Téléchargement échoué');
      }

      const total = Number(response.headers.get('content-length')) || 0;
      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total > 0) {
          this.downloadProgress.set(Math.round((received / total) * 100));
        }
      }

      const blob = new Blob(chunks as BlobPart[]);
      const cache = await caches.open(CACHE_NAME);
      await cache.put(book.url, new Response(blob));

      const current = this.registry().filter(b => b.bookId !== book.bookId);
      this.saveRegistry([...current, book]);
      await this.refreshDownloadedList();
    } catch {
      // Téléchargement abandonné en cas d'échec réseau
    }

    this.downloadingId.set(null);
    this.downloadProgress.set(0);
  }

  async getBookSource(url: string): Promise<string> {
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

  async deleteBook(bookId: string): Promise<void> {
    const entry = this.registry().find(b => b.bookId === bookId);
    if (!entry) return;

    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(entry.url);
    }

    await this.refreshDownloadedList();
    this.saveRegistry(this.registry().filter(b => b.bookId !== bookId));
  }
}
