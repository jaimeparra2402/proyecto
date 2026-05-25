import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    loadComponent: () => import('./feature/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'player-list',
    loadComponent: () => import('./feature/player-list/player-list.page').then((m) => m.PlayerListPage),
  },
  {
    path: 'player-search',
    loadComponent: () => import('./feature/player-search/player-search.page').then((m) => m.PlayerSearchPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./feature/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'player-detail',
    loadComponent: () => import('./feature/player-detail/player-detail.page').then((m) => m.PlayerDetailPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./feature/auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'add-player',
    loadComponent: () => import('./feature/add-player/add-player.page').then((m) => m.AddPlayerPage),
  },
  {
    path: 'ideal-team',
    loadComponent: () => import('./feature/ideal-team/ideal-team.page').then((m) => m.IdealTeamPage),
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
];