import { Component, ErrorHandler, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { BillingEntityListBaseComponent } from 'src/app/lib/oa/bap/components/billing-entity-list-base.component';
import { BankDetail } from 'src/app/lib/oa/bap/models/bank-detail.model';
import { BillingEntity } from 'src/app/lib/oa/bap/models/billing-entity.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { Task } from 'src/app/lib/oa/gateway/models';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { BankDetailDialogComponent } from '../bank-detail-dialog/bank-detail-dialog.component';
import { BillingEntityDialogComponent } from '../billing-entity-dialog/billing-entity-dialog.component';
// import { OrganizationDetailComponent } from '../organization-detail/organization-detail.component';

@Component({
  selector: 'bap-billing-entity-list',
  templateUrl: './billing-entity-list.component.html',
  styleUrls: ['./billing-entity-list.component.css']
})
export class BillingEntityListComponent extends BillingEntityListBaseComponent {
  // @ViewChild('bankDetail')
  // bankDetail: OrganizationDetailComponent;

  @Input()
  parentTask: Task;

  @Output()
  refreshTaskList: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  isAccount = false;

  constructor(
    private taskService: TaskService,
    public api: BillingEntityService,
    public errorHandler: ErrorHandler,
    public uxService: UxService,
    public dialog: MatDialog
  ) {
    super(api, errorHandler, uxService);
  }

  ngOnInit() {
  }

  openBillingEntityDialog(entity: BillingEntity): void {
    const dialogRef = this.dialog.open(BillingEntityDialogComponent, {
      width: '80%'
    });
    dialogRef.componentInstance.parentTask = this.parentTask;
    dialogRef.componentInstance.entity = new BillingEntity(entity) || new BillingEntity({ address: {}, organization: { code: this.organization } });
    dialogRef.componentInstance.label = entity && entity.id ? 'Edit Billing Entity' : 'Add Billing Entity';

    dialogRef.afterClosed().subscribe((result: Task | false) => {
      if (result) {
        this.refreshTaskList.emit();
      }
    });
  }

  editBankDetail(bankDetail: BankDetail, billingEntity: BillingEntity) {
    let isNew = false;
    if (!bankDetail) {
      isNew = true;
      bankDetail = new BankDetail({});
    }
    const dialogRef = this.dialog.open(BankDetailDialogComponent, {
      width: '60%'
    });
    dialogRef.componentInstance.view = 'edit';
    dialogRef.componentInstance.successLabel = 'Request';
    dialogRef.componentInstance.newBank = new BankDetail(bankDetail);

    dialogRef.afterClosed().subscribe((result: BankDetail) => {
      if (result) {
        const payload = {
          status: {
            code: "approved"
          },
          entity: {
            id: billingEntity.id,
            name: billingEntity.name,
            type: 'billingentity'
          },
          parent: {
            id: this.parentTask.id,
          },
          type: `billing|billingentity|update`,
          workflow: {
            code: `billing|billingentity|update`,
          },
          template: {
            code: `billing|billingentity|update`,
          },
          tags: ['finance', 'finance|billingentity', `finance|organization|${billingEntity.organization.code}|billingentity`],
          meta: {
          }
        }
        const changes = [];
        for (let key in result) {
          switch (key) {
            case 'bankName':
              if (bankDetail['bankName'] !== result[key])
                changes.push({ field: 'bankDetail-bankName', value: result[key], oldValue: bankDetail['bankName'], text: 'Bank Name' })
              break;
            case 'account':
              if (bankDetail['account'] !== result[key])
                changes.push({ field: 'bankDetail-account', value: result[key], oldValue: bankDetail['account'], text: 'Account Number' })
              break;
            case 'branch':
              if (bankDetail['branch'] !== result[key])
                changes.push({ field: 'bankDetail-branch', value: result[key], oldValue: bankDetail['branch'], text: 'Branch' })
              break;
            case 'ifscCode':
              if (bankDetail['ifscCode'] !== result[key])
                changes.push({ field: 'bankDetail-ifscCode', value: result[key], oldValue: bankDetail['ifscCode'], text: 'IFSC Code' })
              break;
            case 'beneficiaryName':
              if (bankDetail['beneficiaryName'] !== result[key])
                changes.push({ field: 'bankDetail-beneficiaryName', value: result[key], oldValue: bankDetail['beneficiaryName'], text: 'Beneficiary Name' })
              break;
            case 'beneficiaryPhone':
              if (bankDetail['beneficiaryPhone'] !== result[key])
                changes.push({ field: 'bankDetail-beneficiaryPhone', value: result[key], oldValue: bankDetail['beneficiaryPhone'], text: 'Beneficiary Phone' })
              break;
            case 'beneficiaryEmail':
              if (bankDetail['beneficiaryEmail'] !== result[key])
                changes.push({ field: 'bankDetail-beneficiaryEmail', value: result[key], oldValue: bankDetail['beneficiaryEmail'], text: 'Beneficiary Email' })
              break;
          }
        }

        if (!changes.length) {
          this.uxService.showInfo(`Nothing to update`);
          return;
        }

        payload.meta['changes'] = changes;

        if (!isNew) {
          let index = billingEntity.bankDetails.findIndex((item) => item.account === bankDetail.account);
          if (index > -1) {
            const bankDetails = JSON.parse(JSON.stringify(billingEntity.bankDetails));
            bankDetails[index] = result;
            payload.meta['bankDetails'] = bankDetails;
          }
        }
        this.onRequest(payload);
      }
    });
  }

  onRequest(payload): void {
    this.taskService.create(payload).subscribe((task: Task) => {
    });
  }

}
