import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { RoleService } from '../../core/services';
import { BankDetail } from '../models/bank-detail.model';
import { Organization } from '../models/organization.model';
import { OrganizationService } from '../services';

@Directive()
export class OrganizationDetailsBaseComponent extends DetailBase<Organization> implements OnInit, OnChanges {

  @Input()
  code = 'my';

  @Output()
  bankDetail: EventEmitter<any> = new EventEmitter();

  studentEdit = false;

  bankColumns: string[] = [];

  constructor(
    api: OrganizationService,
    errorHandler: ErrorHandler,
    public auth: RoleService
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {
    this.bankColumns = ['bankName', 'AccountNumber', 'ifsc', 'branch', 'action', 'default'];
    this.get(this.code);
  }

  ngOnChanges() { }

  removeBank(id) {
    this.isProcessing = true;
    this.properties.bankDetails.splice(id, 1);
    this.update(this.properties);
  }

  editBank(item, index) {
    this.bankDetail.emit({ bankDetail: item, index });
  }

}
