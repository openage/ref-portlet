import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileService } from './services';

const angularModules = [CommonModule];
const thirdPartyModules = [];

const services = [
  ProfileService
];

const guards = [];
const sharedComponents = [];
const pipes = [];

@NgModule({
  imports: [
    ...angularModules,
    ...thirdPartyModules
  ],
  exports: [
    ...angularModules,
    ...thirdPartyModules,
    ...sharedComponents,
    ...pipes
  ],
  declarations: [
    ...sharedComponents,
    ...pipes,
  ],
  providers: [
    ...services,
    ...guards
  ]
})
export class DiscoveryModule { }
