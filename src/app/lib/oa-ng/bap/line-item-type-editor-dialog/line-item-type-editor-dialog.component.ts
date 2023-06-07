import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-line-item-type-editor-dialog',
  templateUrl: './line-item-type-editor-dialog.component.html',
  styleUrls: ['./line-item-type-editor-dialog.component.css']
})
export class LineItemTypeEditorDialogComponent implements OnInit {

  @Input() item: any;

  constructor(
    public dialogRef: MatDialogRef<LineItemTypeEditorDialogComponent>
  ) { }

  ngOnInit(): void {
  }

  onTaxValueChange($event, taxCode): void {
    let value = $event.target.value;
    const tax = this.item.taxes.find(tax => tax.type.code === taxCode);
    if (tax) {
      tax.value = value;
    } else {
      this.item.taxes ||= []
      this.item.taxes.push({
        value: value,
        type: { code: taxCode }
      });
    }
  }

  onSubmit(): void {
    this.dialogRef.close(this.item);
  }

}
