import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavService, UxService } from 'src/app/core/services';
import { BankDetail } from 'src/app/lib/oa/bap/models/bank-detail.model';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { Payment } from 'src/app/lib/oa/bap/models/payment.model';
import { InvoiceService } from 'src/app/lib/oa/bap/services';
import { PaymentService } from 'src/app/lib/oa/bap/services/payment.service';
import { BankDetailDialogComponent } from '../bank-detail-dialog/bank-detail-dialog.component';

@Component({
  selector: 'bap-payment-editor',
  templateUrl: './payment-editor.component.html',
  styleUrls: ['./payment-editor.component.css']
})
export class PaymentEditorComponent implements OnInit {

  @Input()
  payment: Payment;

  @Input()
  vendors: any[];
  @Input()
  readonly = false;

  @Output()
  save: EventEmitter<any> = new EventEmitter();

  @Output()
  selected: EventEmitter<Payment> = new EventEmitter();

  isProcessing = false;
  selectedIndex: number;
  driveOptions: any;
  validations: any = {};
  searchParams: any = { name: '' };

  task: any;
  elementList: any[] = [];
  actionSelectedIndex: number = 0;
  types: {
    name: string;
    code: string
  }[] = [
      { name: 'Tax', code: 'tax' },
      { name: 'Debit', code: 'debit' },
      { name: 'Credit', code: 'credit' },
      { name: 'Proforma', code: 'proforma' },
      { name: 'Bill Of Supply', code: 'billOfSupply' },
    ];


  constructor(
    public api: PaymentService,
    public uxService: UxService,
    public navService: NavService,
    private dialog: MatDialog,
    public invoiceService: InvoiceService,
  ) {
  }

  ngOnInit(): void {
    if (this.payment.status == 'paid') {
      this.readonly = true;
    }
  }
  onRow(item, i) {
    this.selectedIndex = i;
  }
  select(invoice) {
    this.selected.emit(invoice);
  }
  onSave(payment) {
    this.save.emit(payment);
  }

  setTask($event): void {
    this.task = $event;
  }

  updatedTask($event, item: Payment) {
    item.status = $event.status;
  }

  public onRemoveInvoice(payment, index): void {
    payment.invoices.splice(index, 1)
  }

  onDueDateChanged($event) {
    this.payment.dueDate = $event;

  }

  onPaidDateChanged($event) {
    this.payment.paidDate = $event;
  }

  actionClicked(event, index) {
    this.actionSelectedIndex = index;
  }
  public onEditorChange(payment: Payment, $event: Payment): void {
    setTimeout(() => {
      payment.amount = $event.amount;
      // payment.taxAmount = $event.taxAmount;
    }, 0);
  }

  public addInvoice(payment): void {
    payment.invoices = payment.invoices || [];
    payment.invoices.push({
      amount: 0,
      status: 'New',
      invoice: new Invoice()
    });
  }
  public onTaskUpdate(payment, event): void {
    payment.status = event.status;
    if (event.currentStatus.isFinal) {
      setTimeout(() => this.ngOnInit(), 0)
    }
  }
  bankDetails(item) {
    if (this.readonly) { return }
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
    component.newBank = new BankDetail({ beneficiaryName: item.receivingBillingEntity.name })

    dialogRef.afterClosed().subscribe((result: BankDetail) => {
      if (result) {
        item.bankDetail = JSON.parse(JSON.stringify(result))
        this.save.emit(item);
      }
    })
  }
  public onInvoiceSelect(invoice, paymentInvoice): void {
    if (!invoice) {
      return
    }
    paymentInvoice.invoice = invoice;
  }
}
