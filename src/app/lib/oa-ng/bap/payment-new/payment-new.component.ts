import { Component, Input, OnInit } from '@angular/core';
import { NavService } from 'src/app/core/services/nav.service';
import { UxService } from 'src/app/core/services/ux.service';
import { Organization } from 'src/app/lib/oa/bap/models/organization.model';
import { Payment } from 'src/app/lib/oa/bap/models/payment.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services/billing-entity.service';
import { PaymentService } from 'src/app/lib/oa/bap/services/payment.service';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { OrganizationService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'bap-payment-new',
  templateUrl: './payment-new.component.html',
  styleUrls: ['./payment-new.component.css']
})
export class PaymentNewComponent implements OnInit {

  isProcessing: boolean = false;

  @Input()
  isPayable: boolean = false;

  searchParams: any = { name: '' };
  newPayment: Payment;

  constructor(
    public api: PaymentService,
    public auth: RoleService,
    public uxService: UxService,
    public navService: NavService,
    public organizationService: OrganizationService
  ) { }

  ngOnInit(): void {
    this.set();
  }

  set(): void {
    this.newPayment = new Payment({
      status: 'paid',
      mode: 'online',
      isPayable: this.isPayable,
      paidDate: new Date()
    });
  }

  onCustomerChange($event): void {
    this.newPayment.payingOrganization = new Organization({ code: $event.code });
  }

  onDateChange($event): void {
    this.newPayment.paidDate = $event;
  }

  validate(): boolean {
    let isValid = true;
    const errors = [];

    if (!this.newPayment.payingOrganization || !this.newPayment.payingOrganization.code) {
      errors.push(`Customer is required`);
    }

    if (!this.newPayment.paidDate) {
      errors.push(`Date is required`);
    }

    if (!this.newPayment.amount) {
      errors.push(`Amount is required`);
    }

    if (this.newPayment?.amount < 0) {
      errors.push(`Amount must be greater than zero`);
    }

    if (!this.newPayment.mode) {
      errors.push(`Mode is required`);
    }

    if (!this.newPayment.transactionId) {
      errors.push(`Transaction ID is required`);
    }

    if (this.newPayment.transactionId?.length > 64) {
      errors.push(`Transaction ID is too long`);
    }

    if (this.newPayment.remarks?.length > 1000) {
      errors.push(`Remarks is too large`);
    }

    if (errors.length) {
      isValid = false;
    }

    if (!isValid) {
      this.uxService.showError(errors);
    }

    return isValid;
  }

  setPaidDate(): void {
    const today = new Date();
    const paidDate = new Date(this.newPayment.paidDate);
    paidDate.setHours(today.getHours(), today.getMinutes(), today.getSeconds());
    this.newPayment.paidDate = paidDate;
  }

  onSave(): void {
    this.setPaidDate();
    if (!this.validate()) return;
    this.isProcessing = true;
    this.api.create(this.newPayment).subscribe((payment: Payment) => {
      this.isProcessing = false;
      this.set();
      this.uxService.showInfo(`Payment successfully created`);
    }, (error: any) => {
      this.isProcessing = false;
    });
  }
}
