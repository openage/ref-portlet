import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { InsightModule } from 'src/app/lib/oa/insight/insight.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { OaDirectoryModule } from '../directory/oa-directory.module';
import { OaSendItModule } from '../send-it/oa-send-it.module';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivitySummaryComponent } from './activity-summary/activity-summary.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { JournalListComponent } from './journal-list/journal-list.component';
import { LogListComponent } from './log-list/log-list.component';
import { ReportAreasComponent } from './report-areas/report-areas.component';
import { ReportDataComponent } from './report-data/report-data.component';
import { ReportDownloadButtonComponent } from './report-download-button/report-download-button.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportTypeListComponent } from './report-type-list/report-type-list.component';
import { ReportTypePickerComponent } from './report-type-picker/report-type-picker.component';
import { TagDetailComponent } from './tag-detail/tag-detail.component';
import { TagTypesSelectorComponent } from './tag-types-selector/tag-types-selector.component';
import { TargetDetailComponent } from './target-detail/target-detail.component';
import { TargetListComponent } from './target-list/target-list.component';
import { TargetNewDialogComponent } from './target-new-dialog/target-new-dialog.component';
import { TargetTypeListComponent } from './target-type-list/target-type-list.component';
import { TargetTypePickerComponent } from './target-type-picker/target-type-picker.component';

const components = [
  ActivityListComponent,
  AnalyticsComponent,
  ActivitySummaryComponent,
  ReportAreasComponent,
  ReportTypeListComponent,
  ReportListComponent,
  ReportDataComponent,
  JournalListComponent,
  TargetListComponent,
  TargetDetailComponent,
  TargetTypePickerComponent,
  TargetNewDialogComponent,
  TagDetailComponent,
  TagTypesSelectorComponent,
  LogListComponent,
  TargetTypeListComponent,
  ReportDownloadButtonComponent,
  ReportTypePickerComponent,
];
const thirdPartyModules = [
  MatCardModule,
  MatTableModule,
  MatGridListModule,
  MatDividerModule,
  MatListModule,
  MatExpansionModule,
  MatChipsModule,
  NgxSkeletonLoaderModule
];

const entryComponents = [
  TargetNewDialogComponent,
];

const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OaSharedModule,
    InsightModule,
    OaDirectoryModule,
    OaSendItModule,
    ...thirdPartyModules
  ],
  declarations: [...components, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services, ...guards]
})
export class OaInsightModule { }
