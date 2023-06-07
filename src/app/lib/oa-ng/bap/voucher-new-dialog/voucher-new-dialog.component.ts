import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { Organization } from 'src/app/lib/oa/bap/models/organization.model';
import { Voucher } from 'src/app/lib/oa/bap/models/voucher.model';
import { VoucherService } from 'src/app/lib/oa/bap/services/voucher.service';
import { Entity } from 'src/app/lib/oa/core/models';

@Component({
  selector: 'bap-voucher-new-dialog',
  templateUrl: './voucher-new-dialog.component.html',
  styleUrls: ['./voucher-new-dialog.component.css']
})
export class VoucherNewDialogComponent implements OnInit {

  isProcessing = false;
  minDate: Date = new Date();

  @Input() invoice: Invoice;

  @Input() vouchersAmount: number = 0;

  @Input() isPayable: boolean = true;
  @Input() entity: Entity;


  @Input() buyer;
  @Input() sellers: Array<{ code: string, name: string }> = [];

  voucher: Voucher;

  constructor(
    private uxService: UxService,
    private api: VoucherService,
    public dialogRef: MatDialogRef<VoucherNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { invoice: Invoice }
  ) {

  }

  ngOnInit(): void {
    this.voucher = new Voucher({
      invoice: this.invoice,
      entity: this.entity,
      isPayable: this.isPayable,
      amount: 0,
      currency: this.invoice?.currency || { code: 'INR', name: 'INR' },
      meta: {
      },
      remarks: '',
      status: 'submitted'
    });

    if (!this.invoice || !this.invoice.id) {
      this.voucher.isAdvance = true;
      this.onTypeChange(this.isPayable);
    }
  }

  onTypeChange(type): void {
    if (type) {
      this.voucher.buyerOrganization = null;
      this.voucher.sellerOrganization = new Organization(this.sellers[0]);
    } else {
      this.voucher.sellerOrganization = null;
      this.voucher.buyerOrganization = new Organization(this.buyer);
    }
  }

  onDueDateChange($event) {
    this.voucher.dueDate = $event;
  }

  onAmountChange($event: any): void { // checking for plan change
    let amount = $event.target.value
    if (amount <= 0) { return; }
    this.voucher.amount = Number(isNaN(amount) ? parseFloat(amount.split(',').join('')) : amount);
  }

  close(result: Voucher | null | boolean): void {
    this.dialogRef.close(result);
  }

  validate(): boolean {
    let isValid = true;
    const errors = [];


    if (!this.voucher.dueDate) {
      errors.push(`Date required`);
    }

    if (!this.voucher.amount) {
      errors.push(`Amount required`);
    }

    if (this.invoice) {
      if (this.voucher.amount > (this.invoice.amount - this.vouchersAmount)) {
        errors.push(`Amount should not be greater than ${this.voucher.currency.name} ${(this.invoice.amount - this.vouchersAmount)}  `);
      }
    }

    if (!this.voucher.invoice) {
      if (this.voucher.isPayable === undefined) {
        errors.push(`Voucher type required`);
      } else {
        if (this.voucher.isPayable) {
          if (!this.voucher.sellerOrganization || !this.voucher.sellerOrganization.code) {
            errors.push(`Seller required`);
          }
        } else {
          if (!this.voucher.buyerOrganization || !this.voucher.buyerOrganization.code) {
            errors.push(`Buyer required`);
          }
        }
      }
    }

    if (errors.length) {
      isValid = false;
    }

    if (!isValid) {
      this.uxService.showError(errors);
    }

    return isValid;
  }

  onSubmit(): void {
    if (!this.validate()) { return; }

    this.isProcessing = true;
    this.api.create(this.voucher).subscribe((response) => {
      this.close(response);
      this.isProcessing = false;
      this.uxService.showSuccess('Payment Request', 'Payment Request Successfully Created!', { hide: { confirm: true, cancel: true }, timer: 2000 });
    }, (err) => {
      this.isProcessing = false;
    })
  }

}



