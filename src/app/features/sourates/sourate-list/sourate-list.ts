import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SourateService } from '../../../core/services/sourate';
import { OfflineAudioService } from '../../../core/services/offline-audio';
import { Sourate } from '../../../core/models/sourate.model';

@Component({
  selector: 'app-sourate-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './sourate-list.html',
  styleUrl: './sourate-list.scss',
})
export class SourateList {
  private sourateService = inject(SourateService);
  offlineAudio = inject(OfflineAudioService);

  sourates = signal<Sourate[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchTerm = signal('');

  downloadedSourateIds = computed<Set<number>>(() =>
    new Set(this.offlineAudio.registry().map(item => item.sourateId))
  );

  filteredSourates = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.sourates();

    return this.sourates().filter(s =>
      s.nom_francais.toLowerCase().includes(term) ||
      s.nom_arabe.includes(term) ||
      s.numero.toString() === term
    );
  });

  constructor() {
    this.sourateService.getAll().subscribe({
      next: (data) => {
        this.sourates.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les sourates. Vérifie que le serveur est bien lancé.');
        this.loading.set(false);
      },
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  isDownloaded(sourateId: number): boolean {
    return this.downloadedSourateIds().has(sourateId);
  }
}
