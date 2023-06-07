import { Component, ErrorHandler, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankDetail } from 'src/app/lib/oa/bap/models/bank-detail.model';
import { OrganizationDetailsBaseComponent } from 'src/app/lib/oa/bap/components/organization-details-base.component';
import { RoleService } from 'src/app/lib/oa/core/services';
import { OrganizationService } from 'src/app/lib/oa/bap/services';
import { UxService, ValidationService } from 'src/app/core/services';


@Component({
  selector: 'bap-bank-detail-dialog',
  templateUrl: './bank-detail-dialog.component.html',
  styleUrls: ['./bank-detail-dialog.component.css']
})
export class BankDetailDialogComponent extends OrganizationDetailsBaseComponent implements OnInit {
  @Input()
  bankDetails: BankDetail[] = [];

  @Input()
  selectedBankDetail: BankDetail;

  @Input()
  readonly = false;

  @Input()
  paymentView = false;

  @Input()
  indexNumber: number;

  @Input()
  view: 'edit' | 'list' = 'list';

  @Input()
  newBank: BankDetail = new BankDetail({ updateEntity: true });

  @Input()
  successLabel: string = 'Save';

  @Output()
  chanegd: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<BankDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public auth: RoleService,
    api: OrganizationService,
    public uxService: UxService,
    public validationService: ValidationService,
    validator: ErrorHandler
  ) {
    super(api, validator, auth);
  }

  ngOnInit() {
    if (this.selectedBankDetail?.account) {
      const bankDetail = this.bankDetails.find((detail) => detail.account === this.selectedBankDetail.account);

      if (bankDetail) {
        bankDetail.isSelected = true;
      } else {
        this.selectedBankDetail.isSelected = true;
        this.bankDetails.push(this.selectedBankDetail);
      }
    }
  }

  updateBank(bankDetail: BankDetail) {
    this.dialogRef.close(bankDetail);
  }

  addNewBankDetail(item?) {
    this.view = 'edit'
    if (item) {
      this.newBank = new BankDetail(item);
    }
  }

  saveNew() {
    if (this.view === 'list') {
      this.dialogRef.close(this.selectedBankDetail);
    } else if (this.validations(this.newBank)) {
      this.dialogRef.close(this.newBank);
    }
  }
  onCancel() {
    if (this.paymentView && this.view === 'edit') {
      this.view = 'list';
    } else {
      this.dialogRef.close()
    }
  }

  onSelect($event) {
    if (this.readonly) {
      return;
    }
    this.selectedBankDetail = $event;
  }

  validations(bank: BankDetail): boolean {
    let isValid = true;
    let isAccountValid = this.validationService.isAccountNumberValid(bank.account);
    let isPhoneValid = this.validationService.isMobileValid(bank.beneficiaryPhone);
    // let isNameValid = this.validationService.isNameValid(bank.beneficiaryName);
    let isBankNameValid = this.validationService.isNameValid(bank.bankName)
    let isEmailValid = this.validationService.isEmailValid(bank.beneficiaryEmail);
    this.errors = []

    if (isAccountValid) {
      this.errors.push('Account Number ' + isAccountValid);
      isValid = false;
    }
    // if (isNameValid) {
    //   this.errors.push('Beneficiary Name is Invalid');
    //   isValid = false;
    // }
    if (bank.beneficiaryPhone && bank.beneficiaryPhone.length) {
      if (isPhoneValid) {
        this.errors.push('Phone Number ' + isPhoneValid);
        isValid = false;
      }
    }
    if (bank.beneficiaryEmail && bank.beneficiaryEmail.length) {
      if (isEmailValid) {
        this.errors.push('Email ' + isEmailValid);
        isValid = false;
      }
    }
    // if (isBankNameValid) {
    //   this.errors.push('Bank Name is Invalid');
    //   isValid = false;
    // }
    if (!bank.ifscCode || bank.ifscCode?.length !== 11) {
      this.errors.push('IFSC Code is Invalid');
      isValid = false;
    }
    if (this.errors.length) {
      isValid = false;
    }

    if (!isValid) {
      this.uxService.showError(this.errors);
    }
    return isValid;
  }

}
