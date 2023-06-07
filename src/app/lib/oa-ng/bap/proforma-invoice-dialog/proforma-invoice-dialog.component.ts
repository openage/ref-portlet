import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { InvoiceHelperService } from 'src/app/lib/oa/bap/services/invoice-helper.service';
import { InvoiceService } from 'src/app/lib/oa/bap/services/invoice.service';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { InvoiceEditorConfig } from '../invoice-editor/invoice-editor-config.interface';

@Component({
  selector: 'bap-proforma-invoice-dialog',
  templateUrl: './proforma-invoice-dialog.component.html',
  styleUrls: ['./proforma-invoice-dialog.component.css']
})
export class ProformaInvoiceDialogComponent implements OnInit {

  @Input() invoice: Invoice;

  @Input() fileUploader: () => any;

  isProcessing: boolean = false;
  changeAmount: boolean = false;
  types: any[];

  editorConfig: InvoiceEditorConfig = {
    hideTask: true,
    addLineItem: true,
    uploadFile: true,
    disableCode: false,
    disableType: false,
    disableTds: true,
    hideSave: true,
    disableDate: true,
    disableReceivedDate: true,
    disableDueDate: true,
    disableAddBank: true,
    disableAmountOnInvoice: false,
    disableBillingEntity: true,
    disableBillToCustomer: true
  };

  constructor(
    private uxService: UxService,
    private taskApi: TaskService,
    private api: InvoiceService,
    private validationService: InvoiceHelperService,
    public dialogRef: MatDialogRef<ProformaInvoiceDialogComponent>,
  ) {
    this.types = this.validationService.invoiceType;
  }

  ngOnInit(): void {
  }

  onSave() {
    const payload: any = {
      code: this.invoice.code,
      type: this.invoice.type
    }

    if (this.changeAmount) {
      payload.amount = this.invoice.amount;
      payload.taxAmount = this.invoice.taxAmount;
      payload.lineItems = this.invoice.lineItems;
      payload.amountOnInvoice = this.invoice.amountOnInvoice;
    }

    const invoice = Object.assign(this.invoice, payload);
    if (!this.validationService.validate(invoice)) { return; }

    this.uxService.onConfirm({
      title: 'Confirm',
      message: 'Are you sure you want to save invoice changes?',
      confirmTitle: 'Confirm',
      cancelTitle: 'Cancel',
    }).subscribe(() => {
      this.isProcessing = true;
      this.api.update(invoice.id, payload).subscribe((resp) => {
        if (payload.amount) {
          this.taskApi.update(this.invoice.meta.taskCode, { status: 'received' }).subscribe(() => {
            this.isProcessing = false;
            this.dialogRef.close(resp);
          });
        } else {
          this.isProcessing = false;
          this.dialogRef.close(resp);
        }
      });
    })
  }
}


