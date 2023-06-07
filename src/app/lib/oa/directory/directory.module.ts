import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectoryRoleService, RoleTypeService } from './services';
import { ContractorService } from './services/contractor.service';
import { DepartmentService } from './services/department.service';
import { DesignationService } from './services/designation.service';
import { DivisionService } from './services/division.service';
import { EmployeeService } from './services/employee.service';
import { OrganizationService } from './services/organization.service';
import { PermissionGroupService } from './services/permission-group.service';
import { SessionService } from './services/session.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';

const angularModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
];

const thirdPartyModules = [
];

const services = [
  EmployeeService,
  DepartmentService,
  DesignationService,
  DivisionService,
  ContractorService,
  OrganizationService,
  UserService,
  DirectoryRoleService,
  RoleTypeService,
  PermissionGroupService,
  TaskService,
  SessionService
];
const guards = [];
const sharedComponents = [];
const pipes = [];

@NgModule({
  imports: [
    ...angularModules,
    ...thirdPartyModules,
  ],

  exports: [
    ...angularModules,
    ...thirdPartyModules,
    ...sharedComponents,
    ...pipes,
  ],
  declarations: [
    ...sharedComponents,
    ...pipes
  ],
  providers: [
    ...services,
    ...guards
  ],
})
export class DirectoryModule { }
