import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavService } from 'src/app/core/services';
import { UxService } from 'src/app/core/services/ux.service';
import { VoucherListBaseComponent } from 'src/app/lib/oa/bap/components/voucher-list-base.component';
import { Invoice } from 'src/app/lib/oa/bap/models/invoice.model';
import { Voucher } from 'src/app/lib/oa/bap/models/voucher.model';
import { VoucherService } from 'src/app/lib/oa/bap/services/voucher.service';
import { Task } from 'src/app/lib/oa/gateway/models/task.model';
import { VoucherNewDialogComponent } from '../voucher-new-dialog/voucher-new-dialog.component';


@Component({
  selector: 'bap-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class VoucherListComponent extends VoucherListBaseComponent {
  before: any = {};
  more: any[] = [];

  task: Task;

  selectedIndex: number;
  isProcessing = false;

  constructor(
    public dialog: MatDialog,
    public api: VoucherService,
    public uxService: UxService,
    public navService: NavService,
  ) {
    super(api, uxService)
  }
  onRow(item, i) {
    this.selectedIndex = i;
  }

  onDateChange($event, item, type) {
    if (type === 'date') {
      item.date = $event;
    }
    if (type === 'dueDate') {
      item.dueDate = $event;
    }
  }

  onSave(voucher) {
    this.isProcessing = true;
    this.api.update(voucher.id, voucher).subscribe(voucher => {
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
    })
  }

  setInvoiceCode(voucher, code) {
    if (code) {
      voucher.invoice = new Invoice({ code });
    } else {
      voucher.invoice = null;
    }
  }

  updatedTask($event, item: Voucher) {
    item.status = $event.status;
  }
  gotoOrder(code) {
    this.navService.goto(`/freight/orders/${code}`);
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
