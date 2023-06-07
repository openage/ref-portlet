import { Contractor } from './contractor.model';
import { Division } from './division.model';

export class CustomFields {
  dom: Date;
  biometricId: string;
  contractor: Contractor;
  division: Division;
  employmentType: string;
  accountNo: string;
  accountHolder: string;
  ifsc: string;
  bank: string;
  branch: string;
  esi: string;
  pf: string;
  uan: string;
  aadhaar: string;
  pan: string;

  constructor(obj?: any) {

    if (!obj) {
      return;
    }
    this.dom = obj.dom;
    this.biometricId = obj.biometricId;
    this.contractor = obj.contractor;
    this.division = obj.division;
    this.employmentType = obj.employmentType;
    this.accountNo = obj.accountNo;
    this.accountHolder = obj.accountHolder;
    this.ifsc = obj.ifsc;
    this.bank = obj.bank;
    this.branch = obj.branch;
    this.esi = obj.esi;
    this.pf = obj.pf;
    this.uan = obj.uan;
    this.aadhaar = obj.aadhaar;
    this.pan = obj.pan;
  }
}
