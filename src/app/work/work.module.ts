import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { OaBapModule } from 'src/app/lib/oa-ng/bap/oa-bap.module';
import { OaCoreModule } from 'src/app/lib/oa-ng/core/core.module';
import { OaDirectoryModule } from 'src/app/lib/oa-ng/directory/oa-directory.module';
import { OaDriveModule } from 'src/app/lib/oa-ng/drive/oa-drive.module';
import { OaGatewayModule } from 'src/app/lib/oa-ng/gateway/oa-gateway.module';
import { OaInsightModule } from 'src/app/lib/oa-ng/insight/oa-insight.module';
import { OaSendItModule } from 'src/app/lib/oa-ng/send-it/oa-send-it.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { CoreModule } from '../core/core.module';
import { NewTaskDialogComponent } from './components/new-task-dialog/new-task-dialog.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MeetingsComponent } from './pages/meetings/meetings.component';
import { ProjectComponent } from './pages/project/project.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ReleaseNewComponent } from './pages/release-new/release-new.component';
import { ReleaseComponent } from './pages/release/release.component';
import { ReleasesComponent } from './pages/releases/releases.component';
import { TaskComponent } from './pages/task/task.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { TimeLogsComponent } from './pages/time-logs/time-logs.component';
import { WorkRoutingModule } from './work-routing.module';
import { TaskNewComponent } from './pages/task-new/task-new.component';

const dialogs = [
  NewTaskDialogComponent
];
@NgModule({
  declarations: [
    ...dialogs,
    ProjectsComponent,
    ProjectComponent,
    NewTaskDialogComponent,
    ReleasesComponent,
    ReleaseComponent,
    ReleaseNewComponent,
    DashboardComponent,
    MeetingsComponent,
    TasksComponent,
    TaskComponent,
    TimeLogsComponent,
    TaskNewComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    OaDirectoryModule,
    OaDriveModule,
    OaSendItModule,
    OaGatewayModule,
    OaBapModule,
    OaInsightModule,
    MatDialogModule,
    OaSharedModule,
    WorkRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    OaCoreModule,
  ],
  exports: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class WorkModule { }
