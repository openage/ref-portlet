import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { BankDetail } from 'src/app/lib/oa/bap/models/bank-detail.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'bap-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent extends DetailBase<any> implements OnInit {

  @Input()
  view: 'card' | 'edit' = 'card';
  @Input()
  readonly = false;
  @Input()
  newBank: BankDetail;
  @Input()
  selectedBankDetail: BankDetail;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();
  @Output()
  edit: EventEmitter<BankDetail> = new EventEmitter();

  constructor(
    api: BillingEntityService,
    public auth: RoleService,
    uxService: UxService
  ) {
    super({ api, errorHandler: uxService });
  }

  ngOnInit(): void {
  }
  onEdit(item) {
    this.edit.emit(item);
  }

}
