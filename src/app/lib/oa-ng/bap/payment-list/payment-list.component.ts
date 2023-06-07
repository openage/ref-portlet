import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavService, UxService } from 'src/app/core/services';
import { PaymentListBaseComponent } from 'src/app/lib/oa/bap/components/payment-list.base.component';
import { BankDetail } from 'src/app/lib/oa/bap/models/bank-detail.model';
import { Payment } from 'src/app/lib/oa/bap/models/payment.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { PaymentService } from 'src/app/lib/oa/bap/services/payment.service';
import { BankDetailDialogComponent } from '../bank-detail-dialog/bank-detail-dialog.component';

@Component({
  selector: 'bap-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent extends PaymentListBaseComponent {

  isProcessing = false;
  selectedIndex: number;
  actionSelectedIndex: number;
  validations: any = {};
  newPayment: Payment = new Payment();

  @Input() view: 'customer' | 'vendor' = 'vendor';
  @Input() isPaginatorHiddem = false;
  @Input() searchParams: any = { name: '' };


  constructor(
    public api: PaymentService,
    public uxService: UxService,
    public navService: NavService,
    public dialog: MatDialog,
    public billingEntityService: BillingEntityService
  ) {
    super(api, uxService);
  }

  ngOnInit() {
    this.validations['bankDetails'] = (item) => {
      const errors = [];
      const missingBankDetails = this.items[this.actionSelectedIndex].bankDetail
      if (!missingBankDetails.account) {
        errors.push(`Bank Account Number is missing`)
        return errors;
      }
      if (!missingBankDetails.ifscCode) {
        errors.push(`Bank IFSC Code is missing`)
        return errors;
      }
      return true;
    };
    this.newPayment.date = new Date();

    // this.validations['bankDetails'] = (item) => {
    //   console.log("onInit", item)
    //   const errors = [];
    //   let count = 0;

    //   const missingBankDetails = this.items[this.actionSelectedIndex].bankDetail
    //   if (!missingBankDetails.account) {
    //     errors.push(`Bank Details are missing`)
    //     return errors;
    //   }
    //   return true;
    // };
  }

  onRow(item, i) {
    this.selectedIndex = i;
  }

  onCheck(item): void {
    item.isChecked = !item.isChecked;
    this.onChecked.emit(item);
  }
  // if Using the oa-amount-editor-component
  // tdsChanged(event, item) {
  //   if (event.value > item.amount) {
  //     this.uxService.showError("TDS amount should be less than or Equal to Total Amount")
  //     // item.tdsSelected = false;
  //   }
  //   if (event.value < item.amount) {
  //     item.tds = event.value;
  //     item.tdsSelected = false;
  //     const payload = { id: item.id };
  //     payload['tds'] = item.tds;
  //     this.save(payload)
  //   }

  // }

  // if using the oa-Input
  tdsChanged(item) {
    if (item.tds > item.amount) {
      this.uxService.showError("TDS amount should be less than or Equal to Total Amount")
      // item.tdsSelected = false;
    }
    if (item.tds <= item.amount) {
      item.tdsSelected = false;
      const payload = { id: item.id };
      payload['tds'] = item.tds;
      this.save(payload)
    }

  }

  onDateChange($event, item, type) {
    const payload = { id: item.id }
    if (type === 'date') {
      payload['date'] = $event;
    }
    if (type === 'paidDate') {
      payload['paidDate'] = $event;
    }
    this.save(payload);
  }

  updatedTask($event, item: Payment) {
    item.status = $event.status;
  }
  tdsClicked(item) {
    if (item.status !== 'paid') {
      item.tdsSelected = true;
    }
  }

  onSelectJob(code: string) {
    this.navService.goto(`/freight/orders/${code}`);
  }

  bankDetails(item) {
    item.receivingBillingEntity.bankDetails.forEach((bank, index) => {
      if (item.bankDetail.account === bank.account) {
        item.receivingBillingEntity.bankDetails.splice(index, 1)
      }
    })
    item.receivingBillingEntity.bankDetails.push(item.bankDetail)
    const dialogRef = this.dialog.open(BankDetailDialogComponent, {
      width: '50%'
    })
    const component = dialogRef.componentInstance;
    // component.code= item.id;
    component.paymentView = true;
    component.readonly = item.status === 'paid';

    component.bankDetails = JSON.parse(JSON.stringify(item.receivingBillingEntity.bankDetails));
    component.selectedBankDetail = JSON.parse(JSON.stringify(item.bankDetail));

    dialogRef.afterClosed().subscribe((result: BankDetail) => {
      if (result) {
        const payload = { id: item.id, bankDetail: result }
        this.save(payload);
      }
    })
  }

  onActionClick(event, item, index) {
    this.actionSelectedIndex = index;
    this.updatedTask(event, item);
  }

  onCustomerSelect(event, item) {
    item.invoices[0].invoice = event
  }

  onCustomerPaymentSave(item: Payment) {
    this.create(item).subscribe(item => { this.fetch() })
  }

  onExpand(item, i): void {
    if (!!item.isSelected) {
      item.isSelected = !item.isSelected;
      this.selectedIndex = null;
    } else {
      this.items.forEach((i) => i.isSelected = false);
      item.isSelected = true;
      this.selectedIndex = i;
    }
  }

  openDialog(custCode) {
  }
}
