import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Verse } from '../models/verse.model';

export interface QuranReciter {
  identifier: string;
  nom: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuranTextService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private versesCache = new Map<number, Observable<Verse[]>>();
  private reciters$?: Observable<QuranReciter[]>;

  getVerses(sourateNumero: number): Observable<Verse[]> {
    if (!this.versesCache.has(sourateNumero)) {
      const request$ = this.http.get<Verse[]>(`${this.apiUrl}/quran-text/${sourateNumero}`).pipe(shareReplay(1));
      this.versesCache.set(sourateNumero, request$);
    }
    return this.versesCache.get(sourateNumero)!;
  }

  getReciters(): Observable<QuranReciter[]> {
    if (!this.reciters$) {
      this.reciters$ = this.http.get<QuranReciter[]>(`${this.apiUrl}/quran-reciters`).pipe(shareReplay(1));
    }
    return this.reciters$;
  }
}
