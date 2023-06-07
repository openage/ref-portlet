import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavService, UxService } from 'src/app/core/services';
import { InvoiceListBaseComponent } from 'src/app/lib/oa/bap/components/invoice-list-base.component';
import { BankDetail } from 'src/app/lib/oa/bap/models/bank-detail.model';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { InvoiceService } from 'src/app/lib/oa/bap/services';
import { Entity } from 'src/app/lib/oa/core/models';
import { OrganizationService } from 'src/app/lib/oa/directory/services';
import { Folder } from 'src/app/lib/oa/drive/models';
import { DocumentService } from 'src/app/lib/oa/drive/services';
import { Task } from 'src/app/lib/oa/gateway/models';
import { GatewayOrganizationService } from 'src/app/lib/oa/gateway/services/organization.service';
import { Conversation } from 'src/app/lib/oa/send-it/models';
import { CurrencyExchangeDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/currency-exchange-dialog/currency-exchange-dialog.component';
import { FileUploaderDialogComponent } from '../../drive/file-uploader-dialog/file-uploader-dialog.component';
import { MessageComposerDialogComponent } from '../../send-it/message-composer-dialog/message-composer-dialog.component';
import { BankDetailDialogComponent } from '../bank-detail-dialog/bank-detail-dialog.component';
import { VoucherNewDialogComponent } from '../voucher-new-dialog/voucher-new-dialog.component';

@Component({
  selector: 'bap-invoice-editor',
  templateUrl: './invoice-editor.component.html',
  styleUrls: ['./invoice-editor.component.css']
})
export class InvoiceEditorComponent {

  @Input()
  invoice: Invoice;

  @Input()
  vendors: any[];

  @Input()
  readonly: boolean = true;

  @Output()
  save: EventEmitter<Invoice> = new EventEmitter();

  @Output()
  selected: EventEmitter<Invoice> = new EventEmitter();

  @Output()
  upload: EventEmitter<Invoice> = new EventEmitter();

  show: boolean = false;
  isProcessing: boolean = false;

  selectedIndex: number;
  driveOptions: any;
  validations: any = {};
  folder: Folder = new Folder({ code: 'root|invoice-detail' });
  task: Task;
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
    public api: InvoiceService,
    public uxService: UxService,
    public navService: NavService,
    private dialog: MatDialog,
    public documentService: DocumentService,
    private directoryOrganizationService: OrganizationService,
    private gatewayOrganizationService: GatewayOrganizationService
  ) {
  }

  ngOnInit(): void {
    if (Object.keys(this.invoice).length <= 2) {
      this.getInvoice(this.invoice.id || this.invoice.code);
    } else {
      this.show = true;
    }

    this.driveOptions = {
      handleError: true,
      createDefault: true,
      folder: new Folder({ code: 'root|invoice-detail' }),
      labelHidden: true,
      isPlaceholder: true,
      meta: {
        description: "",
        identifier: {
          label: "Invoice Number",
          required: true
        }
      }
    }
    this.validations['documents'] = (item) => {
      const errors = [];
      let count = 0;

      const missingFile = this.elementList[this.actionSelectedIndex].missingFile(item.config.status);
      if (missingFile) {
        errors.push(`Invoice Document is required.`)
        return errors;
      }
      return true;
    };
  }

  ngAfterViewInit(): void { }

  getInvoice(code: number | string): void {
    this.isProcessing = true;
    this.api.get(code).subscribe((invoice) => {
      this.invoice = invoice;
      this.show = true;
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
    });
  }

  onRow(item, i) {
    this.selectedIndex = i;
  }

  select(invoice) {
    this.selected.emit(invoice);
  }

  onSave(invoice) {
    this.save.emit(invoice);
  }

  requestForPayment(invoice: Invoice): void {
    const dialogRef = this.dialog.open(VoucherNewDialogComponent, {
      disableClose: true
    });
    const component = dialogRef.componentInstance;
    component.invoice = invoice;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  setTask($event): void {
    this.task = $event;
  }

  onTaskUpdate($event: any): void {
    this.invoice.status = $event.status;
  }

  actionClicked(event, index) {
    this.actionSelectedIndex = index;
  }

  onDownload(type, task) {
    const orderCode: any = task.entity ? task.entity.id : '';
    const code = 'billing|invoices';
    if (orderCode) {
      task.processingDownload = true
      this.documentService.downloadById(code, task.id, type, { 'orderId': orderCode }).subscribe((data) => task.processingDownload = false)
    }
  }

  public openDialog(): void {
    const dialogRef = this.uxService.openDialog(FileUploaderDialogComponent);
    const instance = dialogRef.componentInstance;
    // instance.entity = this.entity;
    instance.doc = this.driveOptions;

    instance.doc.folder.entity = new Entity({ id: this.invoice.id, type: 'invoice' });
    instance.doc.visibility = this.folder ? this.folder.visibility : 1;
    instance.inputView = 'layout';
    instance.doc['code'] = 'invoice';
    instance.doc['entity'] = new Entity({ id: this.invoice.id, type: 'invoice' });
    dialogRef.afterClosed().subscribe((doc) => {
      if (doc) {
        setTimeout(() => { this.upload.emit(this.invoice) }, 10);
        this.uxService.showInfo(`Invoice Successfully Uploaded`, `Invoice Upload`)
      }
    });
  }

  public onEditorChange($event: Invoice): void {
    setTimeout(() => {
      this.invoice.amount = $event.amount;
      this.invoice.taxAmount = $event.taxAmount;
      if (this.invoice.meta?.tdsPercentage) { // re-calculate tds amount
        this.onTdsPercentageChange(this.invoice.meta.tdsPercentage);
      }
    }, 0);
  }

  onDueAmountChange($event) {
    this.invoice.dueAmount = $event;
  }

  onDateChange($event) {
    this.invoice.date = $event;
  }

  onRecievedDateChange($event) {
    this.invoice.receivedDate = $event;
  }

  onDueDateChange($event) {
    this.invoice.dueDate = $event;
  }

  public onTdsPercentageChange(percentage: number): void {
    const tdsAmount = ((this.invoice.amount - this.invoice.taxAmount) * percentage) / 100;
    this.invoice.meta.tdsPercentage = percentage;
    this.invoice.meta.tds = Number.parseFloat(tdsAmount.toFixed(2));
  }

  public viewPayment(payment): void {

  }

  public bankDetails(): void {
    if (this.readonly) return;
    const dialogRef = this.dialog.open(BankDetailDialogComponent, { width: '50%' });
    const component = dialogRef.componentInstance;
    component.paymentView = true;

    component.bankDetails = this.invoice.sellerBillingEntity.bankDetails.map((bank) => new BankDetail(bank));
    component.selectedBankDetail = new BankDetail(this.invoice.bankDetail);

    dialogRef.afterClosed().subscribe((result: BankDetail) => {
      if (result) {
        this.invoice.bankDetail = JSON.parse(JSON.stringify(result))
        // this.save.emit(this.invoice);
      }
    })
  }

  public openCurrencyEditorDialog(): void {
    if (this.readonly) return;
    const dialogRef = this.dialog.open(CurrencyExchangeDialogComponent);
    const component = dialogRef.componentInstance;
    component.currency = JSON.parse(JSON.stringify(this.invoice.currency));

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.invoice.currency = result
      }
    })
  }

  private openMessageComposerDialog(template: string, emails: string[]): void {
    const templateCode = 'billing|invoices';
    // const driveApi = this.auth.currentApplication().services.find((s) => s.code === 'drive');
    // const attachmentUrl = `${driveApi.url}/docs/${templateCode}/${this.invoice.id}.pdf?role-key=${this.auth.getRoleKey()}`;

    const dialogRef = this.dialog.open(MessageComposerDialogComponent, {
      width: '800px'
    });

    // dialogRef.componentInstance.attachments = [{
    //   filename: `${this.invoice.id}.pdf`,
    //   url: attachmentUrl,
    //   mimeType: 'application/pdf'
    // }];

    const orderCode: string = this.invoice.entity.id as string;

    dialogRef.componentInstance.to = emails;
    dialogRef.componentInstance.conversation = new Conversation({ entity: this.task.entity });
    dialogRef.componentInstance.modes = { sms: false, email: true, push: false, chat: false };
    dialogRef.componentInstance.message.subject = `Invoice for Order No. '${orderCode.toUpperCase()}' has been Generated.`
    dialogRef.componentInstance.template = template;
    dialogRef.componentInstance.data = { invoiceId: this.invoice.id }

    dialogRef.afterClosed().subscribe((result) => {
      //TODO:
    });
  }

  public sendEmail(template = 'customer|invoice'): void {
    let emails = [];

    const orgCode: string = this.invoice.buyerOrganization.code;
    this.gatewayOrganizationService.get(orgCode).subscribe((organization) => {
      emails = organization.members.filter(member => member.roles.includes('finance')).map((member) => member.user.email);
      if (!emails.length) {
        this.directoryOrganizationService.get(orgCode).subscribe((organization) => {
          emails = [organization.email];
          this.openMessageComposerDialog(template, emails);
        })
      } else {
        this.openMessageComposerDialog(template, emails);
      }
    })


  }
}
