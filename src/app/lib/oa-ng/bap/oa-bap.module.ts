import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BapModule } from 'src/app/lib/oa/bap/bap.module';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { OaDirectoryModule } from 'src/app/lib/oa-ng/directory/oa-directory.module';
import { OaGatewayModule } from 'src/app/lib/oa-ng/gateway/oa-gateway.module';
import { BillingEntityDetailsComponent } from './billing-entity-details/billing-entity-details.component';
import { BillingEntityDialogComponent } from './billing-entity-dialog/billing-entity-dialog.component';
import { BillingEntityGstEditorComponent } from './billing-entity-gst-editor/billing-entity-gst-editor.component';
import { BillingEntityListComponent } from './billing-entity-list/billing-entity-list.component';
import { BillingEntityPickerComponent } from './billing-entity-picker/billing-entity-picker.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { InvoiceListDialogComponent } from './invoice-list-dialog/invoice-list-dialog.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { LineItemsEditorComponent } from './line-items-editor/line-items-editor.component';
import { OrganizationNewBankDetailComponent } from './organization-new-bank-detail/organization-new-bank-detail.component';
import { OrganizationSubscriptionComponent } from './organization-subscription/organization-subscription.component';
import { PlanPickerComponent } from './plan-picker/plan-picker.component';
import { SubscriptionDialogComponent } from './subscription-dialog/subscription-dialog.component';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { LineItemTypeListComponent } from './line-item-type-list/line-item-type-list.component';
import { LineItemTypeEditorDialogComponent } from './line-item-type-editor-dialog/line-item-type-editor-dialog.component';
import { VoucherListComponent } from './voucher-list/voucher-list.component';
import { VoucherDetailsComponent } from './voucher-details/voucher-details.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { VoucherNewDialogComponent } from './voucher-new-dialog/voucher-new-dialog.component';
import { BankDetailDialogComponent } from './bank-detail-dialog/bank-detail-dialog.component';
import { OaDriveModule } from '../drive/oa-drive.module';
import { BankDetailListComponent } from './bank-detail-list/bank-detail-list.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { CustomerPaymentInvoicesComponent } from './customer-payment-invoices/customer-payment-invoices.component';
import { InvoiceEditorComponent } from './invoice-editor/invoice-editor.component';
import { PaymentEditorComponent } from './payment-editor/payment-editor.component';

const components = [
  OrganizationSubscriptionComponent,
  SubscriptionComponent,
  BillingEntityListComponent,
  BillingEntityPickerComponent,
  PlanPickerComponent,
  SubscriptionListComponent,
  BillingEntityGstEditorComponent,
  InvoiceListComponent,
  InvoiceDetailsComponent,
  LineItemsEditorComponent,
  BillingEntityDetailsComponent,
  LineItemTypeListComponent,
  VoucherListComponent,
  VoucherDetailsComponent,
  PaymentListComponent,
  PaymentDetailsComponent,
  VoucherNewDialogComponent,
  BankDetailListComponent,
  BankDetailsComponent,
  CustomerPaymentInvoicesComponent,
  InvoiceEditorComponent,
  PaymentEditorComponent,
  BankDetailDialogComponent,
  BankDetailListComponent,
  BankDetailsComponent
];

const entryComponents = [
  OrganizationNewBankDetailComponent,
  SubscriptionDialogComponent,
  BillingEntityDialogComponent,
  InvoiceListDialogComponent,
  VoucherNewDialogComponent,
  LineItemTypeEditorDialogComponent
];

const thirdPartyModules = [
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatCardModule,
  MatListModule,
  MatTableModule,
];
const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OaSharedModule,
    BapModule,
    OaGatewayModule,
    OaDirectoryModule,
    OaDriveModule,
    ...thirdPartyModules,
  ],
  declarations: [...components, ...entryComponents, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services, ...guards],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OaBapModule { }
