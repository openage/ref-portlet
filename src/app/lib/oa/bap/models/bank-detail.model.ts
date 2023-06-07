import { ModelBase } from '../../core/models';

export class BankDetail extends ModelBase {
  account: string;
  branch: string;
  bankName: string;
  ifscCode: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  beneficiaryPhone: string;
  updateEntity?: boolean;
  isDefault: boolean;

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }

    this.account = obj.account;
    this.bankName = obj.bankName;
    this.branch = obj.branch;
    this.ifscCode = obj.ifscCode;
    this.beneficiaryName = obj.beneficiaryName;
    this.beneficiaryEmail = obj.beneficiaryEmail;
    this.beneficiaryPhone = obj.beneficiaryPhone;
    this.updateEntity = obj.updateEntity || false;
    this.isDefault = obj.isDefault || false;
  }
}
