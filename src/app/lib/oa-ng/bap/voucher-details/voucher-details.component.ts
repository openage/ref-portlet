import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { Voucher } from 'src/app/lib/oa/bap/models/voucher.model';
import { VoucherService } from 'src/app/lib/oa/bap/services/voucher.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-voucher-details',
  templateUrl: './voucher-details.component.html',
  styleUrls: ['./voucher-details.component.css']
})
export class VoucherDetailsComponent extends DetailBase<Voucher> implements OnInit {

  @Input()
  code: string;

  isProcessing = false;

  constructor(
    api: VoucherService,
    public auth: RoleService,
    uxService: UxService
  ) {
    super({ api, errorHandler: uxService });
  }

  ngOnInit() {
    if (this.code) {
      this.get(this.code).subscribe((item) => {
        this.set(new Voucher(item));
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.hasOwnProperty('code')) {
      this.ngOnInit();
    }
  }

  onOrder() { }

  onChange(): void {
  }
}
