import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  authService = inject(AuthService);
  private router = inject(Router);

  showConfirmModal = signal(false);
  showMoreMenu = signal(false);

  toggleMoreMenu(): void {
    this.showMoreMenu.update(v => !v);
  }

  closeMoreMenu(): void {
    this.showMoreMenu.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('[data-more-menu]')) {
      this.showMoreMenu.set(false);
    }
  }

  askLogoutConfirmation(): void {
    this.showConfirmModal.set(true);
  }

  cancelLogout(): void {
    this.showConfirmModal.set(false);
  }

  confirmLogout(): void {
    this.showConfirmModal.set(false);
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/']),
    });
  }
}
