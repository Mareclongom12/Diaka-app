import { Component, inject, signal, computed, ElementRef, ViewChildren, QueryList, HostListener, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FavoriService } from '../../../core/services/favori';
import { SourateService } from '../../../core/services/sourate';
import { QuranTextService, QuranReciter } from '../../../core/services/quran-text';
import { OfflineAudioService } from '../../../core/services/offline-audio';
import { PlayerService } from '../../../core/services/player';
import { Sourate } from '../../../core/models/sourate.model';
import { Verse } from '../../../core/models/verse.model';

const RECITEURS_PRINCIPAUX = ['ar.alafasy', 'ar.abdurrahmaansudais', 'ar.saoodshuraym', 'ar.mahermuaiqly'];

@Component({
  selector: 'app-sourate-detail',
  imports: [RouterLink],
  templateUrl: './sourate-detail.html',
  styleUrl: './sourate-detail.scss',
})
export class SourateDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sourateService = inject(SourateService);
  private quranTextService = inject(QuranTextService);
  favoriService = inject(FavoriService);
  offlineAudio = inject(OfflineAudioService);
  player = inject(PlayerService);

  @ViewChildren('verseEl') verseElements!: QueryList<ElementRef<HTMLElement>>;

  sourateId = signal<number>(Number(this.route.snapshot.paramMap.get('id')));
  sourate = signal<Sourate | undefined>(undefined);
  sourateLoading = signal(true);
  verses = signal<Verse[]>([]);
  versesLoading = signal(true);
  reciters = signal<QuranReciter[]>([]);
  showBackToTop = signal(false);

  audioUrls = computed<string[]>(() =>
    this.verses().map(v => `https://cdn.islamic.network/quran/audio/128/${this.selectedReciterIdentifier()}/${v.numero_global}.mp3`)
  );

  isFullyDownloaded = computed<boolean>(() => {
    const urls = this.audioUrls();
    if (urls.length === 0) return false;
    return this.offlineAudio.isSourateFullyDownloaded(urls);
  });

  private isThisSouratePlaying = computed<boolean>(() => this.player.sourate()?.id === this.sourateId());

  selectedReciterIdentifier = computed<string>(() =>
    this.isThisSouratePlaying() ? this.player.reciterIdentifier() : 'ar.alafasy'
  );

  currentVerseIndex = computed<number>(() => this.isThisSouratePlaying() ? this.player.currentVerseIndex() : -1);
  isPlaying = computed<boolean>(() => this.isThisSouratePlaying() && this.player.isPlaying());

  constructor() {
    this.sourateService.getById(this.sourateId()).subscribe({
      next: (data) => {
        this.sourate.set(data);
        this.sourateLoading.set(false);
      },
      error: () => this.sourateLoading.set(false),
    });

    this.quranTextService.getVerses(this.sourateId()).subscribe({
      next: (data) => {
        this.verses.set(data);
        this.versesLoading.set(false);
      },
      error: () => this.versesLoading.set(false),
    });

    this.quranTextService.getReciters().subscribe({
      next: (data) => {
        const filtered = data.filter(r => RECITEURS_PRINCIPAUX.includes(r.identifier));
        this.reciters.set(filtered);
      },
    });

    effect(() => {
      const idx = this.currentVerseIndex();
      if (this.isThisSouratePlaying() && idx >= 0) {
        this.scrollToVerse(idx);
      }
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop.set(window.scrollY > 400);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFavori(): void {
    this.favoriService.toggle(this.sourateId());
  }

  selectReciter(identifier: string): void {
    const reciter = this.reciters().find(r => r.identifier === identifier);
    const nom = reciter?.nom ?? identifier;

    if (this.isThisSouratePlaying()) {
      this.player.changeReciter(identifier, nom);
      return;
    }

    const s = this.sourate();
    if (!s) return;

    this.player.start(
      { id: s.id, numero: s.numero, nomFrancais: s.nom_francais },
      this.verses(),
      identifier,
      nom,
      0
    );
  }
  async downloadSourate(): Promise<void> {
    const s = this.sourate();
    if (!s) return;

    const reciter = this.reciters().find(r => r.identifier === this.selectedReciterIdentifier());

    await this.offlineAudio.downloadSourate({
      sourateId: s.id,
      sourateNumero: s.numero,
      nomFrancais: s.nom_francais,
      reciterIdentifier: this.selectedReciterIdentifier(),
      reciterNom: reciter?.nom ?? this.selectedReciterIdentifier(),
      urls: this.audioUrls(),
    });

    this.router.navigate(['/telechargements']);
  }

  togglePlayback(): void {
    const s = this.sourate();
    if (!s) return;

    if (this.isThisSouratePlaying()) {
      this.player.toggle();
      return;
    }

    const reciter = this.reciters().find(r => r.identifier === this.selectedReciterIdentifier());
    this.player.start(
      { id: s.id, numero: s.numero, nomFrancais: s.nom_francais },
      this.verses(),
      this.selectedReciterIdentifier(),
      reciter?.nom ?? this.selectedReciterIdentifier(),
      0
    );
  }

  playVerse(index: number): void {
    const s = this.sourate();
    if (!s) return;

    if (this.isThisSouratePlaying()) {
      this.player.playIndex(index);
      return;
    }

    const reciter = this.reciters().find(r => r.identifier === this.selectedReciterIdentifier());
    this.player.start(
      { id: s.id, numero: s.numero, nomFrancais: s.nom_francais },
      this.verses(),
      this.selectedReciterIdentifier(),
      reciter?.nom ?? this.selectedReciterIdentifier(),
      index
    );
  }

  private scrollToVerse(index: number): void {
    setTimeout(() => {
      const el = this.verseElements?.get(index);
      el?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }
}
