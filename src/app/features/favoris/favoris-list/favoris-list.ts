import { Component, inject, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriService } from '../../../core/services/favori';
import { SourateService } from '../../../core/services/sourate';
import { Sourate } from '../../../core/models/sourate.model';

@Component({
  selector: 'app-favoris-list',
  imports: [RouterLink],
  templateUrl: './favoris-list.html',
  styleUrl: './favoris-list.scss',
})
export class FavorisList {
  favoriService = inject(FavoriService);
  private sourateService = inject(SourateService);

  allSourates = signal<Sourate[]>([]);

  constructor() {
    this.sourateService.getAll().subscribe(data => this.allSourates.set(data));
  }

  sourates = computed(() => {
    const ids = this.favoriService.getAllSourateIds();
    return this.allSourates().filter(s => ids.includes(s.id));
  });
}
