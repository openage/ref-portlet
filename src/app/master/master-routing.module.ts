import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DesignationComponent } from './pages/designation/designation.component';
import { DesignationsComponent } from './pages/designations/designations.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { DepartmentComponent } from './pages/department/department.component';
import { DivisionsComponent } from './pages/divisions/divisions.component';
import { DivisionComponent } from './pages/division/division.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent
}, {
  path: 'dashboard',
  component: DashboardComponent
}, {
  path: 'employees',
  component: EmployeesComponent,
  children: [{
    path: ':code',
    component: EmployeeComponent
  }]
}, {
  path: 'designations',
  component: DesignationsComponent,
  children: [{
    path: ':code',
    component: DesignationComponent
  }]
}, {
  path: 'departments',
  component: DepartmentsComponent,
  children: [{
    path: ':code',
    component: DepartmentComponent
  }]
}, {
  path: 'divisions',
  component: DivisionsComponent,
  children: [{
    //   path: 'new',
    //   component: DivisionNewComponent,
    // }, {
    path: ':code',
    component: DivisionComponent,
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule { }
