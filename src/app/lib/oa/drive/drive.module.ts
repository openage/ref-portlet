import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DocsService, FolderService } from './services';
import { UserService } from './services/user.service';

const angularModules = [
  CommonModule
];

const sharedComponents = [
];

const thirdPartyModules = [];
const services = [
  DocsService,
  FolderService,
  UserService
];
const guards = [];
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
export class DriveModule { }
