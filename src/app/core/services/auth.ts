import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { FavoriService } from './favori';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private favoriService = inject(FavoriService);
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);

  register(name: string, email: string, password: string, password_confirmation: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password, password_confirmation })
      .pipe(tap(res => this.setSession(res)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => this.setSession(res)));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(tap(() => this.clearSession()));
  }

  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  private setSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    this.currentUser.set(res.user);
    this.favoriService.loadFavoris();
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  invalidateSession(): void {
    this.clearSession();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
