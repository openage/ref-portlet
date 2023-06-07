import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { Payment } from 'src/app/lib/oa/bap/models/payment.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { PaymentService } from 'src/app/lib/oa/bap/services/payment.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'bap-customer-payment-invoices-details',
  templateUrl: './customer-payment-invoices-details.component.html',
  styleUrls: ['./customer-payment-invoices-details.component.css']
})
export class CustomerPaymentInvoicesDetailsComponent extends DetailBase<Payment> implements OnInit {

  @Input()
  code: string;
  @Input() searchParams: any = { code: '' };
  isProcessing = false;

  constructor(
    public api: PaymentService,
    public billingService: BillingEntityService,
    public auth: RoleService,
    uxService: UxService
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
  onEntitySelect(event) { }
}
