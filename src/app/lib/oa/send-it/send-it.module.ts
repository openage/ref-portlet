import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  ChannelService,
  ConversationService,
  DocumentService,
  JobService,
  MessageService,
  OrganizationService,
  ProviderService,
  PushNotificationsService,
  TemplateService,
  TenantService,
  UserService
} from './services';

const angularModules = [CommonModule];
const thirdPartyModules = [];

const services = [
  ProviderService,
  ChannelService,
  TemplateService,
  TenantService,
  OrganizationService,
  JobService,
  MessageService,
  ConversationService,
  DocumentService,
  UserService,
  PushNotificationsService
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
    ...pipes
  ],
  providers: [
    ...services,
    ...guards
  ]
})
export class SendItModule { }
