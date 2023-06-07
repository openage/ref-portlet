import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { OaCoreModule } from '../core/core.module';
import { OaDriveModule } from 'src/app/lib/oa-ng/drive/oa-drive.module';
import { GatewayModule } from 'src/app/lib/oa/gateway/gateway.module';
import { OaDirectoryModule } from '../directory/oa-directory.module';
import { MemberListComponent } from './member-list/member-list.component';
import { NewProjectDialogComponent } from './new-project-dialog/new-project-dialog.component';
import { NewReleaseDialogComponent } from './new-release-dialog/new-release-dialog.component';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';
import { OrganizationPickerComponent } from './organization-picker/organization-picker.component';
import { ProjectButtonComponent } from './project-button/project-button.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectPickerComponent } from './project-picker/project-picker.component';
import { ProjectSummaryComponent } from './project-summary/project-summary.component';
import { ReleaseButtonComponent } from './release-button/release-button.component';
import { ReleaseListComponent } from './release-list/release-list.component';
import { ReleaseOngoingListComponent } from './release-ongoing-list/release-ongoing-list.component';
import { ReleaseSummaryExpandableComponent } from './release-summary-expandable/release-summary-expandable.component';
import { ReleaseSummaryComponent } from './release-summary/release-summary.component';
import { ReleaseTimelineComponent } from './release-timeline/release-timeline.component';
import { SprintDetailComponent } from './sprint-detail/sprint-detail.component';
import { SprintListComponent } from './sprint-list/sprint-list.component';
import { StatePickerComponent } from './state-picker/state-picker.component';
import { TaskActionsComponent } from './task-actions/task-actions.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListDialogComponent } from './task-list-dialog/task-list-dialog.component';
import { TaskListComponent } from './task-list/task-list.component';
import { NewTaskComponent } from './task-new/task-new.component';
import { TaskStatesComponent } from './task-states/task-states.component';
import { TaskStatusBarComponent } from './task-status-bar/task-status-bar.component';
import { TaskSyncButtonComponent } from './task-sync-button/task-sync-button.component';
import { TimeLogListComponent } from './time-log-list/time-log-list.component';
import { WorkflowSelectorComponent } from './workflow-selector/workflow-selector.component';
import { WorkspaceStepperComponent } from './workspace-stepper/workspace-stepper.component';
import { TimeLogNewComponent } from './time-log-new/time-log-new.component';
import { TaskPickerComponent } from './task-picker/task-picker.component';
import { CategoryPickerComponent } from './category-picker/category-picker.component';
import { ReleaseComponent } from './release/release.component';
import { ReleaseActionsComponent } from './release-actions/release-actions.component';
import { SprintsComponent } from './sprints/sprints.component';
import { CloseSprintDialogComponent } from './close-sprint-dialog/close-sprint-dialog.component';
import { NewTaskDialogComponent } from './new-task-dialog/new-task-dialog.component';

const components = [
  ProjectListComponent,
  ProjectSummaryComponent,
  NewProjectDialogComponent,
  ProjectButtonComponent,
  MemberListComponent,
  ReleaseListComponent,
  ReleaseSummaryComponent,
  TaskListComponent,
  TaskSyncButtonComponent,
  NewReleaseDialogComponent,
  ReleaseTimelineComponent,
  ReleaseSummaryExpandableComponent,
  ReleaseButtonComponent,
  ReleaseOngoingListComponent,
  TaskActionsComponent,
  TaskStatesComponent,
  TaskDetailComponent,
  NewTaskComponent,
  TaskStatusBarComponent,
  SprintDetailComponent,
  SprintListComponent,
  StatePickerComponent,
  OrganizationPickerComponent,
  OrganizationDetailsComponent,
  ProjectPickerComponent,
  TaskListDialogComponent,
  TimeLogListComponent,
  WorkspaceStepperComponent,
  WorkflowSelectorComponent,
  TimeLogNewComponent,
  TaskPickerComponent,
  CategoryPickerComponent,
  ReleaseComponent,
  ReleaseActionsComponent,
  SprintsComponent,
  CloseSprintDialogComponent,
  NewTaskDialogComponent
];
const thirdPartyModules = [
  MatCardModule,
  MatExpansionModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatInputModule,
  MatTooltipModule,
  MatTableModule,
  MatBadgeModule,
  DragDropModule
];
const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    GatewayModule,
    OaSharedModule,
    OaDirectoryModule,
    OaDriveModule,
    OaCoreModule,
    ...thirdPartyModules,
  ],
  declarations: [...components, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services, ...guards]
})
export class OaGatewayModule { }
