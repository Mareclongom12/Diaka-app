import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OfflineAudioService } from '../../../core/services/offline-audio';

@Component({
  selector: 'app-telechargements',
  imports: [RouterLink],
  templateUrl: './telechargements.html',
  styleUrl: './telechargements.scss',
})
export class Telechargements {
  offlineAudio = inject(OfflineAudioService);

  async remove(sourateId: number, reciterIdentifier: string): Promise<void> {
    await this.offlineAudio.deleteSourate(sourateId, reciterIdentifier);
  }
}
