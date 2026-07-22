import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { Sourate } from '../models/sourate.model';
import { Audio } from '../models/audio.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SourateService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private allSourates$?: Observable<Sourate[]>;
  private byIdCache = new Map<number, Sourate>();

  getAll(): Observable<Sourate[]> {
    if (!this.allSourates$) {
      this.allSourates$ = this.http.get<Sourate[]>(`${this.apiUrl}/sourates`).pipe(
        tap(list => list.forEach(s => this.byIdCache.set(s.id, s))),
        shareReplay(1)
      );
    }
    return this.allSourates$;
  }

  getById(id: number): Observable<Sourate> {
    const cached = this.byIdCache.get(id);
    if (cached) {
      return new Observable(subscriber => {
        subscriber.next(cached);
        subscriber.complete();
      });
    }

    return this.http.get<Sourate>(`${this.apiUrl}/sourates/${id}`).pipe(
      tap(s => this.byIdCache.set(s.id, s))
    );
  }

  getAudios(sourateId: number, reciterId?: number): Observable<Audio[]> {
    const params = reciterId ? `?reciter_id=${reciterId}` : '';
    return this.http.get<Audio[]>(`${this.apiUrl}/sourates/${sourateId}/audios${params}`);
  }
}
