import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./feature/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'player-detail',
    loadComponent: () => import('./feature/player-detail/player-detail.page').then( m => m.PlayerDetailPage)
  },
];
