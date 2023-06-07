import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavService, UxService } from 'src/app/core/services';
import { Payment } from 'src/app/lib/oa/bap/models/payment.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { PaymentService } from 'src/app/lib/oa/bap/services/payment.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'bap-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent extends DetailBase<Payment> implements OnInit {

  @Input()
  code: string;
  @Input() view: any;

  isProcessing = false;

  constructor(
    public billingEntityService: BillingEntityService,
    api: PaymentService,
    public auth: RoleService,
    uxService: UxService,
    public dialog: MatDialog,
    public navService: NavService
  ) {
    super({ api, errorHandler: uxService });
  }

  ngOnInit() {
    if (this.code) {
      this.get(this.code).subscribe((item) => {
        this.set(new Payment(item));
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes && changes.hasOwnProperty('code')) {
    //   this.ngOnInit();
    // }
  }

  onOrder() { }

  onChange($event, from) {
    this.update(this.properties);
  }
  // onBillingEntityChange(event) {
  //   this.code;
  // }
  openCustomerDialog(code) {
  }
  openVendorDialog(code) {
  }
  gotoInvoice(invoice) {
    if (invoice.isPayable) {
      this.navService.goto(`/finance/invoices/payable/${invoice.id}`);
    } else {
      this.navService.goto(`/finance/invoices/receivable/${invoice.id}`);
    }
  }
}
