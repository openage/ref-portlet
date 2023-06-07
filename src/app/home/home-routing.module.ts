import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../core/guards/role.guard';
import { ErrorComponent } from '../core/pages/error/error.component';
import { FileComponent } from '../core/pages/file/file.component';
import { MessageComponent } from '../core/pages/message/message.component';
import { TaskComponent } from '../work/pages/task/task.component';
import { TasksComponent } from '../work/pages/tasks/tasks.component';
import { TimeLogsComponent } from '../work/pages/time-logs/time-logs.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FilesComponent } from './pages/files/files.component';
import { InboxComponent } from './pages/inbox/inbox.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RolesComponent } from './pages/roles/roles.component';
import { TeamComponent } from './pages/team/team.component';
const routes: Routes = [{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full'
}, {
  path: 'roles',
  component: RolesComponent,
}, {
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [RoleGuard]
}, {
  path: 'errors/:code',
  component: ErrorComponent
}, {
  path: 'time-logs/:code',
  component: TimeLogsComponent
}, {
  path: 'tasks',
  component: TasksComponent,
  canActivate: [RoleGuard],
  data: {
    path: '/home/tasks',
    for: { type: 'assignee', code: 'my' }
  },
  children: [{
    path: ':taskCode',
    component: TaskComponent,
    data: {
      path: '/home/tasks/:taskCode'
    },
    children: [{
      path: 'files/:fileCode',
      component: FileComponent,
      data: {
        path: '/home/tasks/:taskCode/files/:fileCode',
        for: { type: 'task', code: ':taskCode' }
      },
    }]
  }],
}, {
  path: 'team',
  children: [{
    path: ':taskCode',
    component: TeamComponent
  }],
  canActivate: [RoleGuard],
  data: { permissions: ['organization.supervisor'] }
}, {
  path: 'profile',
  component: ProfileComponent,
  canActivate: [RoleGuard]
}, {
  path: 'folders/:code',
  component: FilesComponent,
  children: [{
    path: 'files/:fileCode',
    component: FilesComponent
  }],
  canActivate: [RoleGuard]
}, {
  path: 'inbox',
  component: InboxComponent,
  children: [
    {
      path: ':code',
      component: MessageComponent,
    },
  ],
  canActivate: [RoleGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
