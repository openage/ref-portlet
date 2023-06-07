import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskComponent } from './pages/task/task.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { FileComponent } from '../home/pages/file/file.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ReleaseNewComponent } from './pages/release-new/release-new.component';
import { ReleaseComponent } from './pages/release/release.component';
import { ReleasesComponent } from './pages/releases/releases.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { TaskNewComponent } from './pages/task-new/task-new.component';


const routes: Routes = [{
  path: '',
  component: DashboardComponent
}, {
  path: 'dashboard',
  component: DashboardComponent
}, {
  path: 'documents/:code',
  component: FileComponent,
}, {
  path: 'releases/:code',
  component: ReleaseComponent,
}, {
  path: 'tasks',
  component: TasksComponent,
  children: [{
    path: 'new',
    component: TaskComponent
  }, {
    path: ':code',
    component: TaskComponent,
    children: [{
      path: ':child',
      component: TaskComponent
    }]
  }]
}, {
  path: 'projects',
  component: ProjectsComponent,
  children: [{
    path: ':code',
    component: ProjectComponent,
    children: [{
      path: 'tasks',
      component: TasksComponent,
      children: [{
        path: 'new',
        component: TaskNewComponent
      }, {
        path: ':taskCode',
        component: TaskComponent
      }]
    }, {
      path: 'meetings',
      component: MeetingsComponent,
    }, {
      path: 'releases',
      component: ReleasesComponent,
      children: [{
        path: 'new',
        component: ReleaseNewComponent
      }]
    }]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkRoutingModule { }
