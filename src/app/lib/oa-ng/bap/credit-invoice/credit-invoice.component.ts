import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { InvoiceHelperService } from 'src/app/lib/oa/bap/services/invoice-helper.service';
import { InvoiceService } from 'src/app/lib/oa/bap/services/invoice.service';
import { InvoiceEditorConfig } from '../invoice-editor/invoice-editor-config.interface';

@Component({
  selector: 'bap-credit-invoice',
  templateUrl: './credit-invoice.component.html',
  styleUrls: ['./credit-invoice.component.css']
})
export class CreditInvoiceComponent implements OnInit {

  @Input() invoice: Invoice;
  @Input() view: 'default' | 'dialog' = 'default';

  isProcessing: boolean = false;
  editorConfig: InvoiceEditorConfig = {
    uploadFile: true,
    disableType: true,
    disableTds: true,
    hideSave: true,
    disableAmountOnInvoice: false,
    disableBillingEntity: true,
    disableBillToCustomer: true
  };

  constructor(
    private api: InvoiceService,
    private uxService: UxService,
    private validationService: InvoiceHelperService,
    public dialogRef: MatDialogRef<CreditInvoiceComponent>,
  ) { }

  ngOnInit(): void {
  }

  onSave() {
    if (!this.validationService.validate(this.invoice)) { return; }
    this.uxService.onConfirm({
      title: 'Confirm',
      message: 'Are you sure you want to save credit changes?',
      confirmTitle: 'Confirm',
      cancelTitle: 'Cancel',
    }).subscribe(() => {
      this.isProcessing = true;
      this.api.create(this.invoice).subscribe((resp) => {

        this.isProcessing = false;
        this.dialogRef.close(resp);
      });
    })
  }
}
