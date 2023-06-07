import { Address, ModelBase } from '../../core/models';
import { BankDetail } from './bank-detail.model';
import { Organization } from './organization.model';

export class BillingEntity extends ModelBase {
  type: string;
  navCode: string;

  gst: string;
  pan: string;

  tds: number;
  orgType: string;

  isDomestic: boolean;
  isGstNumberRequired: boolean;

  currency: {
    name: string,
    code: string
  };

  address: Address;
  correspondenceAddress: Address;
  meta: any;

  bankDetails: BankDetail[];
  organization: Organization;

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.gst = obj.gst;
    this.pan = obj.pan;
    this.tds = obj.tds;
    this.meta = obj.meta;
    this.type = obj.type;
    this.orgType = obj.orgType;
    this.navCode = obj.navCode;
    this.isDomestic = obj.isDomestic;
    this.isGstNumberRequired = obj.isGstNumberRequired;
    this.currency = obj.currency || {};
    if (obj.bankDetails && obj.bankDetails.length) {
      this.bankDetails = obj.bankDetails.map((item) => new BankDetail(item));
    }
    this.address = new Address(obj.address);
    this.correspondenceAddress = new Address(obj.correspondenceAddress);
    this.organization = new Organization(obj.organization);
  }
}
