import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InvoiceService, OrganizationService } from './services';
import { CurrencyService } from './services/currency.service';
import { PaymentService } from './services/payment.service';

const angularModules = [CommonModule];
const thirdPartyModules = [];

const services = [
  OrganizationService,
  CurrencyService,
  InvoiceService,
  PaymentService
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
export class BapModule { }
