import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { VoucherService } from 'src/app/lib/oa/bap/services/voucher.service';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';

@Component({
  selector: 'bap-receivable-voucher-due-date-selector',
  templateUrl: './receivable-voucher-due-date-selector.component.html',
  styleUrls: ['./receivable-voucher-due-date-selector.component.css']
})
export class ReceivableVoucherDueDateSelectorComponent implements OnInit {

  @Input()
  voucher: any

  dueDate: Date = new Date();

  @Output()
  changed: EventEmitter<any> = new EventEmitter()

  constructor(
    public auth: RoleService,
    private voucherService: VoucherService,
    private uxService: UxService
  ) { }

  ngOnInit(): void {
    if (this.voucher.dueDate) {
      let dateParts = this.voucher.dueDate.split('-');
      this.dueDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
    }
  }

  onSelect(event) {
    if (this.voucher?.voucherCode) {
      this.voucherService.update(this.voucher.voucherCode, { dueDate: event }).subscribe(() => {
        this.changed.emit(event);
        this.uxService.showInfo(`Voucher ${this.voucher.voucherCode} updated successfully`);
      })
    }
  }

}
