import { Address, IUser, ModelBase, Pic } from '../../core/models';
import { BankDetail } from './bank-detail.model';
import { Subscription } from './subscription.model';

export class Organization extends ModelBase {
  email: string;
  phone: string;
  shortName: string;
  logo: Pic;
  config: any;
  bankDetails: BankDetail[] = [];
  type: string;
  navCode: string;
  address: Address;
  owner: IUser;

  subscription: Subscription;

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }

    this.email = obj.email;
    this.phone = obj.phone;
    this.shortName = obj.shortName;
    this.logo = new Pic(obj.logo);
    this.config = obj.config;
    this.bankDetails = [];
    if (obj.bankDetails && obj.bankDetails.length) {
      obj.bankDetails.forEach((detail) => {
        this.bankDetails.push(new BankDetail(detail));
      });
    }
    this.type = obj.type;
    this.address = new Address(obj.address);
    this.owner = obj.owner;
    this.subscription = new Subscription(obj.subscription);
    this.navCode = obj.navCode;
  }

}
