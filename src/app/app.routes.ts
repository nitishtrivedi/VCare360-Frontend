import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './auth-guard';
import { ServiceSelector } from './components/service-selector/service-selector';
import { Dashboard } from './components/daycare/dashboard/dashboard';
import { Dashboard as PreSchoolDashboard } from './components/preschool/dashboard/dashboard';
import { Profile } from './components/users/profile/profile';
import { ManageUsers } from './components/users/manage-users/manage-users';
import { Daycarelayout } from './components/daycare/layout/daycarelayout/daycarelayout';

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
  {
    path: 'users/profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'users/manage-users',
    component: ManageUsers,
    canActivate: [authGuard],
  },
  {
    path: 'daycare',
    component: Daycarelayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  {
    path: 'preschool/dashboard',
    component: PreSchoolDashboard,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'login' },
];
