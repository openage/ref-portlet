import { Component, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { Entity } from 'src/app/lib/oa/core/models';
@Component({
  selector: 'app-invoice-list-dialog',
  templateUrl: './invoice-list-dialog.component.html',
  styleUrls: ['./invoice-list-dialog.component.css']
})
export class InvoiceListDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InvoiceListDialogComponent>
  ) { }

  @Input()
  view: string;

  @Input()
  entity: Entity;

  @Input()
  columns: any[] = [];

  selectedItem: Invoice;

  ngOnInit() {
  }
  onSelect(item: Invoice) {
    this.selectedItem = item;
  }

  onCustomerFetch() {

  }
  onSupplierFetch() {

  }
  onSubmit() {
    this.dialogRef.close(this.selectedItem);
  }
}
