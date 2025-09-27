import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './auth-guard';
import { ServiceSelector } from './components/service-selector/service-selector';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'users/select-service',
    component: ServiceSelector,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
