import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { Navbar } from './shared/navbar/navbar';
import { MiniPlayer } from './shared/mini-player/mini-player';
import { AuthService } from './core/services/auth';
import { FavoriService } from './core/services/favori';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, MiniPlayer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('DIAKA-app');

  private authService = inject(AuthService);
  private favoriService = inject(FavoriService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  showNavbar = signal(true);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.favoriService.loadFavoris();
    }

    this.updateNavbarVisibility();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateNavbarVisibility();
    });
  }

  private updateNavbarVisibility(): void {
    let route = this.activatedRoute.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    }
    this.showNavbar.set(!route.data['hideNavbar']);
  }
}
