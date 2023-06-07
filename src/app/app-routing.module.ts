import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './core/guards/guest.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('src/app/home/home.module').then((m) => m.HomeModule),
    canActivate: [RoleGuard],
  },
  {
    path: 'work',
    loadChildren: () =>
      import('src/app/work/work.module').then((m) => m.WorkModule),
    canActivate: [RoleGuard],
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('src/app/reports/reports.module').then((m) => m.ReportsModule),
    canActivate: [RoleGuard],
  },
  {
    path: 'master',
    loadChildren: () =>
      import('src/app/master/master.module').then((m) => m.MasterModule),
    canActivate: [RoleGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('src/app/settings/settings.module').then((m) => m.SettingsModule),
    canActivate: [RoleGuard],
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('src/app/reports/reports.module').then((m) => m.ReportsModule),
    canActivate: [RoleGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      preloadingStrategy: PreloadAllModules,
      // enableTracing: true
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
