import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { VoucherService } from 'src/app/lib/oa/bap/services/voucher.service';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';

@Component({
  selector: 'bap-receivable-voucher-status-button',
  templateUrl: './receivable-voucher-status-button.component.html',
  styleUrls: ['./receivable-voucher-status-button.component.css']
})
export class ReceivableVoucherStatusButtonComponent implements OnInit {

  @Input()
  voucher: any;

  @Output()
  changed: EventEmitter<any> = new EventEmitter()

  dueDate: Date = new Date();

  constructor(
    public auth: RoleService,
    private voucherService: VoucherService,
    private uxService: UxService
  ) { }

  ngOnInit(): void {
  }

  onClick(status) {
    if (this.voucher?.voucherCode) {
      this.voucherService.update(this.voucher.voucherCode, { status: status }).subscribe(() => {
        this.uxService.showInfo(`Voucher ${this.voucher.voucherCode} updated successfully`);
      })
    }
  }
}
