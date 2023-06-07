import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FilesComponent } from './pages/files/files.component';
import { FolderComponent } from './pages/folder/folder.component';

import { OrganizationComponent } from './pages/organization/organization.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full',
}, {
  path: 'dashboard',
  component: DashboardComponent
}, {
  path: 'organization',
  component: OrganizationComponent
}, {
  path: 'folders',
  children: [{
    path: ':code',
    component: FolderComponent,
  }]
}, {
  path: 'files',
  children: [{
    path: ':type',
    component: FilesComponent,
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
