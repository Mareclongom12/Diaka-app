import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player';

@Component({
  selector: 'app-mini-player',
  imports: [RouterLink],
  templateUrl: './mini-player.html',
  styleUrl: './mini-player.scss',
})
export class MiniPlayer {
  player = inject(PlayerService);

  close(): void {
    this.player.stop();
  }
}
