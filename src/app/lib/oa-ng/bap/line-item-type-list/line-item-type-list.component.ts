import { Component, ErrorHandler, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { LineItemTypeListBaseComponent } from 'src/app/lib/oa/bap/components/line-item-type-list-base.component';
import { LineItemTypeService } from 'src/app/lib/oa/bap/services/line-item-type.service';
import { LineItemTypeEditorDialogComponent } from '../line-item-type-editor-dialog/line-item-type-editor-dialog.component';

@Component({
  selector: 'bap-line-item-type-list',
  templateUrl: './line-item-type-list.component.html',
  styleUrls: ['./line-item-type-list.component.css']
})
export class LineItemTypeListComponent extends LineItemTypeListBaseComponent {

  constructor(
    private api: LineItemTypeService,
    public uxService: UxService,
    private errorHandler: ErrorHandler,
    private dialog: MatDialog
  ) {
    super(api, errorHandler, uxService);
  }

  openEditor(item): void {
    const dialogRef = this.dialog.open(LineItemTypeEditorDialogComponent);
    const component = dialogRef.componentInstance;
    component.item = item;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.update(item);
      }
    })
  }

  onTaxValueChange($event, taxCode, item): void {
    let value = $event.target.value;
    const tax = item.taxes.find(tax => tax.type.code === taxCode);
    if (tax) {
      tax.value = value;
    } else {
      item.taxes ||= []
      item.taxes.push({
        value: value,
        type: { code: taxCode }
      });
    }
  }

}
