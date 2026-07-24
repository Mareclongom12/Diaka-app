import { Component, inject, signal, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth';
import { LanguageService, AppLanguage } from '../../core/services/language';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  authService = inject(AuthService);
  languageService = inject(LanguageService);
  private router = inject(Router);

  showConfirmModal = signal(false);
  showMoreMenu = signal(false);

  toggleMoreMenu(): void {
    this.showMoreMenu.update(v => !v);
  }

  closeMoreMenu(): void {
    this.showMoreMenu.set(false);
  }

  onLanguageChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as AppLanguage;
    this.languageService.setLanguage(value);
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
