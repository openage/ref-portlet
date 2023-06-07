import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportDashboardComponent } from './pages/report-dashboard/report-dashboard.component';
import { ReportComponent } from './pages/report/report.component';
import { ReportsComponent } from './pages/reports/reports.component';

const routes: Routes = [{
  path: '',
  component: ReportDashboardComponent,
  children: [{
    path: ':areaCode',
    component: ReportsComponent,
    children: [{
      path: ':reportTypeCode',
      component: ReportComponent,
    }]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule { }
