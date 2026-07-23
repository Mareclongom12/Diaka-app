import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Favori } from '../models/favori.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private favoris = signal<Favori[]>([]);

  loadFavoris(): void {
    this.http.get<Favori[]>(`${this.apiUrl}/favoris`).subscribe({
      next: (data) => this.favoris.set(data),
      error: () => this.favoris.set([]),
    });
  }

  isFavori(sourateId: number): boolean {
    return this.favoris().some(f => f.sourate_id === sourateId);
  }

  toggle(sourateId: number): void {
    const existing = this.favoris().find(f => f.sourate_id === sourateId);

    if (existing) {
      this.http.delete(`${this.apiUrl}/favoris/${existing.id}`).subscribe({
        next: () => this.favoris.set(this.favoris().filter(f => f.id !== existing.id)),
      });
    } else {
      this.http.post<Favori>(`${this.apiUrl}/favoris`, { sourate_id: sourateId }).subscribe({
        next: (favori) => this.favoris.set([...this.favoris(), favori]),
      });
    }
  }

  getAllSourateIds(): number[] {
    return this.favoris().map(f => f.sourate_id);
  }

  count(): number {
    return this.favoris().length;
  }
}
