import { Component, ErrorHandler, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrganizationDetailsBaseComponent } from 'src/app/lib/oa/bap/components/organization-details-base.component';
import { BankDetail } from 'src/app/lib/oa/bap/models/bank-detail.model';
import { OrganizationService } from 'src/app/lib/oa/bap/services';
import { RoleService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'app-organization-new-bank-detail',
  templateUrl: './organization-new-bank-detail.component.html',
  styleUrls: ['./organization-new-bank-detail.component.css']
})

export class OrganizationNewBankDetailComponent extends OrganizationDetailsBaseComponent {

  @Input()
  bank: BankDetail = new BankDetail({});

  @Input()
  indexNumber: number;
  @Input() readonly = false;
  @Output()
  chanegd: EventEmitter<any> = new EventEmitter();

  constructor(
    public orgService: OrganizationService,
    public auth: RoleService,
    validator: ErrorHandler,
    public dialogRef: MatDialogRef<OrganizationNewBankDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(orgService, validator, auth);
  }


  updateOrg() {
    if (this.indexNumber) {
      this.properties.bankDetails[this.indexNumber] = this.bank;
    } else {
      this.properties.bankDetails.push(this.bank);
    }
    this.orgService.update(this.properties.id, this.properties).subscribe((org) => {
      this.dialogRef.close(org);
    });
  }

}
