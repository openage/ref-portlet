import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { AgmCoreModule } from '@agm/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { BrandingComponent } from './branding/branding.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { CurrentRoleComponent } from './current-role/current-role.component';
import { PageDivsComponent } from './page-divs/page-divs.component';
import { ValidateEmailMobileComponent } from './validate-email-mobile/validate-email-mobile.component';
import { ValidateOtpDialogComponent } from './validate-otp-dialog/validate-otp-dialog.component';
import { ValidateOtpInlineComponent } from './validate-otp-inline/validate-otp-inline.component';
import { BarGraphWidgetComponent } from './widgets/bar-graph-widget/bar-graph-widget.component';
import { BubbleWidgetComponent } from './widgets/bubble-widget/bubble-widget.component';
import { CalendarDateComponent } from './widgets/calendar-date/calendar-date.component';
import { CalendarWidgetComponent } from './widgets/calendar-widget/calendar-widget.component';
import { CalenderDayDetailComponent } from './widgets/calender-day-detail/calender-day-detail.component';
import { DualBarWidgetComponent } from './widgets/dual-bar-widget/dual-bar-widget.component';
import { FileWidgetComponent } from './widgets/file-widget/file-widget.component';
import { FilesWidgetComponent } from './widgets/files-widget/files-widget.component';
import { FolderWidgetComponent } from './widgets/folder-widget/folder-widget.component';
import { FoldersWidgetComponent } from './widgets/folders-widget/folders-widget.component';
import { GoogleMapComponent } from './widgets/google-map-widget/google-map-widget.component';
import { GraphWidgetComponent } from './widgets/graph-widget/graph-widget.component';
import { GridWidgetComponent } from './widgets/grid-widget/grid-widget.component';
import { HeatMapMonthComponent } from './widgets/heat-map-month/heat-map-month.component';
import { HeatMapWidgetComponent } from './widgets/heat-map-widget/heat-map-widget.component';
import { LoginActivityComponent } from './widgets/login-activity/login-activity.component';
import { PieChartWidgetComponent } from './widgets/pie-chart-widget/pie-chart-widget.component';
import { ProfileWidgetComponent } from './widgets/profile-widget/profile-widget.component';
import { ProgressLineGraphWidgetComponent } from './widgets/progress-line-graph-widget/progress-line-graph-widget.component';
import { QuickLinksComponent } from './widgets/quick-links/quick-links.component';
import { TableWidgetComponent } from './widgets/table-widget/table-widget.component';
import { TargetWidgetComponent } from './widgets/target-widget/target-widget.component';

const widgets = [
  GridWidgetComponent,
  TargetWidgetComponent,
  TableWidgetComponent,
  GraphWidgetComponent,
  BarGraphWidgetComponent,
  CalendarWidgetComponent,
  CalendarDateComponent,
  CalenderDayDetailComponent,
  HeatMapWidgetComponent,
  HeatMapMonthComponent,
  GoogleMapComponent,
  BubbleWidgetComponent,
  PieChartWidgetComponent,
  DualBarWidgetComponent,
  ProgressLineGraphWidgetComponent,
  ProfileWidgetComponent,
  LoginActivityComponent,
  FoldersWidgetComponent,
  FolderWidgetComponent,
  FilesWidgetComponent,
  FileWidgetComponent,
];

const components = [
  PageDivsComponent,
  QuickLinksComponent,
  ValidateOtpDialogComponent,
  ValidateEmailMobileComponent,
  ValidateOtpInlineComponent,
  ValidateOtpInlineComponent,
  BreadcrumbComponent,
  BrandingComponent,
  ContextMenuComponent,
  CurrentRoleComponent
];
const dialogs = []
const thirdPartyModules = [
  MatTableModule,
  MatTooltipModule

  // AgmCoreModule.forRoot({
  //   apiKey: 'AIzaSyA3-BQmJVYB6_soLJPv7cx2lFUMAuELlkM',
  //   libraries: ['places']
  // }),
];
const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    OaSharedModule,
    ...thirdPartyModules
  ],
  declarations: [...widgets, ...components, ...pipes, ...dialogs],
  exports: [...widgets, ...components, ...pipes, ...dialogs],
  providers: [...services, ...guards]
})
export class OaCoreModule { }
