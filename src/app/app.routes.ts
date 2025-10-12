import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './auth-guard';
import { ServiceSelector } from './components/service-selector/service-selector';
import { Dashboard } from './components/daycare/dashboard/dashboard';
import { Dashboard as PreSchoolDashboard } from './components/preschool/dashboard/dashboard';
import { Profile } from './components/users/profile/profile';
import { ManageUsers } from './components/users/manage-users/manage-users';
import { Daycarelayout } from './components/daycare/layout/daycarelayout/daycarelayout';
import { Listenquiry } from './components/daycare/enquiries/listenquiry/listenquiry';
import { Addenquiry } from './components/daycare/enquiries/addenquiry/addenquiry';
import { SelectacademicyearDaycare } from './components/daycare/selectacademicyear-daycare/selectacademicyear-daycare';
import { SelectacademicyearPreschool } from './components/preschool/selectacademicyear-preschool/selectacademicyear-preschool';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  ////////////////////////////////////////////////////////////////////
  //     USERS ROUTES ////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////
  //     DAYCARE ROUTES //////////////////////////////////////////////
  {
    path: 'daycare/select-ay',
    component: SelectacademicyearDaycare,
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
      {
        path: 'enquiries',
        component: Listenquiry,
      },
      {
        path: 'enquiries/add',
        component: Addenquiry,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  ////////////////////////////////////////////////////////////////////
  //     PRESCHOOL ROUTES ////////////////////////////////////////////
  {
    path: 'preschool/select-ay',
    component: SelectacademicyearPreschool,
    canActivate: [authGuard],
  },
  {
    path: 'preschool',
    component: PreSchoolDashboard,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: PreSchoolDashboard,
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
