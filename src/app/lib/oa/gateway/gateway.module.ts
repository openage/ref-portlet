import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MemberService,
  ProjectService,
  ProjectTypeService,
  ReleaseService,
  SprintService,
  TaskService,
  TimeLogService,
  WorkflowsService
} from './services';
import { CategoryService } from './services/category.service';

const angularModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule
];

const thirdPartyModules = [
];

const services = [
  TaskService,
  ReleaseService,
  ProjectService,
  ProjectTypeService,
  SprintService,
  MemberService,
  WorkflowsService,
  TimeLogService,
  CategoryService
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
    ...pipes
  ],
  declarations: [
    ...sharedComponents,
    ...pipes
  ],
  providers: [
    ...services,
    ...guards
  ]
})
export class GatewayModule { }
