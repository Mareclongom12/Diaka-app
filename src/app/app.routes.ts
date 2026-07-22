import { Routes } from '@angular/router';
import { Landing } from './features/landing/landing/landing';
import { SourateList } from './features/sourates/sourate-list/sourate-list';
import { SourateDetail } from './features/sourates/sourate-detail/sourate-detail';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { FavorisList } from './features/favoris/favoris-list/favoris-list';
import { Telechargements } from './features/telechargements/telechargements/telechargements';
import { Quiz } from './features/quiz/quiz/quiz';
import { Profile } from './features/profile/profile/profile';
import { NotFound } from './features/not-found/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { Calendrier } from './features/calendrier/calendrier/calendrier';
import { Dhikr } from './features/dhikr/dhikr/dhikr';
import { HorairesPrieres } from './features/horaires-prieres/horaires-prieres/horaires-prieres';
import { Ablutions } from './features/ablutions/ablutions/ablutions';

export const routes: Routes = [
  { path: '', component: Landing, data: { hideNavbar: true } },
  { path: 'sourates', component: SourateList, canActivate: [authGuard] },
  { path: 'sourates/:id', component: SourateDetail, canActivate: [authGuard] },
  { path: 'login', component: Login, data: { hideNavbar: true } },
  { path: 'register', component: Register, data: { hideNavbar: true } },
  { path: 'favoris', component: FavorisList, canActivate: [authGuard] },
  { path: 'telechargements', component: Telechargements, canActivate: [authGuard] },
  { path: 'quiz', component: Quiz, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'calendrier', component: Calendrier, canActivate: [authGuard] },
  { path: 'dhikr', component: Dhikr, canActivate: [authGuard] },
  { path: 'horaires-prieres', component: HorairesPrieres, canActivate: [authGuard] },
  { path: 'ablutions', component: Ablutions, canActivate: [authGuard] },
  { path: '**', component: NotFound, data: { hideNavbar: true } },
];
