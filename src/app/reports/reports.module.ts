import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { CoreModule } from '../core/core.module';
import { OaBapModule } from 'src/app/lib/oa-ng/bap/oa-bap.module';
import { OaDirectoryModule } from 'src/app/lib/oa-ng/directory/oa-directory.module';
import { OaDriveModule } from 'src/app/lib/oa-ng/drive/oa-drive.module';
import { OaInsightModule } from 'src/app/lib/oa-ng/insight/oa-insight.module';
import { OaSendItModule } from 'src/app/lib/oa-ng/send-it/oa-send-it.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { OaCoreModule } from 'src/app/lib/oa-ng/core/core.module';
import { ReportDashboardComponent } from './pages/report-dashboard/report-dashboard.component';
import { ReportComponent } from './pages/report/report.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [ReportsComponent, ReportComponent, ReportDashboardComponent],
  imports: [
    CoreModule,
    CommonModule,
    OaDirectoryModule,
    OaDriveModule,
    OaCoreModule,
    OaSendItModule,
    OaInsightModule,
    ReportsRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    OaSharedModule,
    OaBapModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: []
})
export class ReportsModule { }
