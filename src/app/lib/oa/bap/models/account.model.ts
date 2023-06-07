import { IUser, ModelBase } from '../../core/models';
import { Organization } from './organization.model';

export class Account extends ModelBase { 
    level: string;
    balance: number;
    available: number;
    user: IUser;
    organization: Organization;
    
    constructor(obj?: any) {
      super(obj);
      if (!obj) { return; }

      this.level = obj.level;
      this.balance = obj.balance;
      this.available = obj.available;

      this.organization = new Organization(obj.organization)
    }
}