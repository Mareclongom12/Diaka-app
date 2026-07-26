import { Component, inject, signal, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { WuduService } from '../../../core/services/wudu';

@Component({
  selector: 'app-ablutions',
  imports: [TranslatePipe],
  templateUrl: './ablutions.html',
  styleUrl: './ablutions.scss',
})
export class Ablutions {
  wuduService = inject(WuduService);

  currentIndex = signal(0);
  viewMode = signal<'guide' | 'liste'>('guide');
  currentStep = computed(() => this.wuduService.steps()[this.currentIndex()]);
  progress = computed(() => ((this.currentIndex() + 1) / this.wuduService.steps().length) * 100);
  isFirst = computed(() => this.currentIndex() === 0);
  isLast = computed(() => this.currentIndex() === this.wuduService.steps().length - 1);
  private touchStartX = 0;
  private touchStartY = 0;
  swipeDirection = signal<'left' | 'right' | null>(null);

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const deltaY = event.changedTouches[0].clientY - this.touchStartY;

    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    const threshold = 50;
    if (deltaX < -threshold) {
      this.triggerSwipe('left');
      this.next();
    } else if (deltaX > threshold) {
      this.triggerSwipe('right');
      this.previous();
    }
  }

  private triggerSwipe(direction: 'left' | 'right'): void {
    this.swipeDirection.set(direction);
    setTimeout(() => this.swipeDirection.set(null), 300);
  }

  next(): void {
    if (!this.isLast()) {
      this.currentIndex.update(i => i + 1);
    }
  }

  previous(): void {
    if (!this.isFirst()) {
      this.currentIndex.update(i => i - 1);
    }
  }

  goToStep(index: number): void {
    this.currentIndex.set(index);
    this.viewMode.set('guide');
  }

  restart(): void {
    this.currentIndex.set(0);
  }

  setViewMode(mode: 'guide' | 'liste'): void {
    this.viewMode.set(mode);
  }
}
