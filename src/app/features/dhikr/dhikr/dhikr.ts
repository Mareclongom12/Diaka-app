import { Component, inject, signal } from '@angular/core';
import { DhikrService } from '../../../core/services/dhikr';

@Component({
  selector: 'app-dhikr',
  imports: [],
  templateUrl: './dhikr.html',
  styleUrl: './dhikr.scss',
})
export class Dhikr {
  dhikrService = inject(DhikrService);

  targetOptions = [33, 99, 100, 1000];
  showResetConfirm = signal(false);

  tap(): void {
    this.dhikrService.increment();
  }

  selectPhrase(id: string): void {
    this.dhikrService.selectPhrase(id);
  }

  setTarget(target: number): void {
    this.dhikrService.setTarget(target);
  }

  resetSession(): void {
    this.dhikrService.resetSession();
  }

  askResetTotal(): void {
    this.showResetConfirm.set(true);
  }

  confirmResetTotal(): void {
    this.dhikrService.resetTotalForSelected();
    this.showResetConfirm.set(false);
  }

  cancelResetTotal(): void {
    this.showResetConfirm.set(false);
  }

  circumference = 2 * Math.PI * 90;

  dashOffset(progress: number): number {
    return this.circumference - (progress / 100) * this.circumference;
  }
}
