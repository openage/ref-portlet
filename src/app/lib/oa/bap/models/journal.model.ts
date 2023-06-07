import { Entity, IUser, ModelBase } from '../../core/models';
import { Account } from './account.model';
import { Organization } from './organization.model';

export class Journal extends ModelBase { 
    type: string;
    amount: string;
    purpose: string;

    entity: Entity;
    date: Date;

    balance: {
        before: number;
        after: number;
    }
    
    remarks: string;
    meta: object;

    user: IUser;
    account: Account;
    organization: Organization;
    
    constructor(obj?: any) {
      super(obj);
      if (!obj) { return; }

      this.type = obj.type;
      this.amount = obj.amount;
      this.purpose = obj.purpose;

      this.date = obj.date;
      this.entity = obj.entity;

      this.balance = obj.balance;
     
      this.meta = obj.meta;
      this.remarks = obj.remarks;

      this.account = new Account(obj.account);

      this.user = new IUser(obj.user);
      this.organization = new Organization(obj.organization)
    }
}