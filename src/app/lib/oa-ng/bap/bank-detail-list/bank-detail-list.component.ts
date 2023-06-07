import { Component, ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { BankDetail } from 'src/app/lib/oa/bap/models/bank-detail.model';
import { BillingEntity } from 'src/app/lib/oa/bap/models/billing-entity.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { BankDetailDialogComponent } from '../bank-detail-dialog/bank-detail-dialog.component';

@Component({
  selector: 'bap-bank-detail-list',
  templateUrl: './bank-detail-list.component.html',
  styleUrls: ['./bank-detail-list.component.css']
})
export class BankDetailListComponent implements OnInit, OnChanges {

  @Input()
  view = 'summary';

  @Input()
  items: BankDetail[] = [];

  @Input()
  readonly: false;

  @Input()
  selectedBankDetail: BankDetail;

  @Input()
  billingEntity: BillingEntity;

  @Output()
  select: EventEmitter<BankDetail> = new EventEmitter();
  @Output()
  edit: EventEmitter<BankDetail> = new EventEmitter();



  constructor(
    errorHandler: ErrorHandler,
    public uxService: UxService,
    public dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit() {
  }
  addNewBank() {
    const bankDetails = {}
    bankDetails['beneficiaryName'] = this.billingEntity.name
    this.select.emit(new BankDetail(bankDetails))
  }
}
