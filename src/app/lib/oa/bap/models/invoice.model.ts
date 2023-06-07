import { IUser, ModelBase } from '../../core/models';
import { Entity } from '../../core/models/entity.model';
import { BankDetail } from './bank-detail.model';
import { BillingEntity } from './billing-entity.model';
import { Currency } from './currency.model';
import { LineItem } from './line-items.model';
import { Organization } from './organization.model';
import { Tax } from './tax.model';

export class Invoice extends ModelBase {

  parent: Invoice;

  type: string;
  isPayable: boolean;

  entity: Entity;

  billToCustomer: boolean;
  remarks: string;

  amount: number;
  dueAmount: number;
  paidAmount: number;

  taxAmount: number;
  discountAmount: number;

  taxes: any[];
  discount: any[];

  date: Date;
  dueDate: Date;

  receivedDate: Date;

  lineItems: LineItem[];

  currency: {
    name: string;
    code: string;
    ratio?: Object;
  };
  status: string;
  tags: string[];

  order: any;
  meta: any;

  buyer: IUser;
  seller: IUser;

  buyerOrganization: Organization;
  sellerOrganization: Organization;

  buyerBillingEntity: BillingEntity;
  sellerBillingEntity: BillingEntity;
  bankDetail: BankDetail;

  credit?: {
    duration?: number
  };

  amountOnInvoice: number; // Amount on invoice received from seller

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }
    this.code = obj.code;
    this.entity = obj.entity;

    this.type = obj.type;

    this.remarks = obj.remarks;
    this.billToCustomer = obj.billToCustomer;

    this.isPayable = obj.isPayable;

    this.amount = obj.amount;
    this.dueAmount = obj.dueAmount;
    this.paidAmount = obj.paidAmount;

    this.taxAmount = obj.taxAmount || 0;
    this.discountAmount = obj.discountAmount || 0;

    this.date = obj.date;
    this.dueDate = obj.dueDate;
    this.receivedDate = obj.receivedDate;

    this.lineItems = obj.lineItems;

    this.currency = obj.currency;
    this.tags = obj.tags;
    this.status = obj.status;

    this.order = obj.order;
    this.meta = obj.meta;

    this.buyer = obj.buyer;
    this.seller = obj.seller;

    this.taxes = obj.taxes;
    this.discount = obj.discount;

    this.parent = new Invoice(obj.parent);
    this.bankDetail = new BankDetail(obj.bankDetail);

    this.amountOnInvoice = obj.amountOnInvoice;

    if (obj.buyerOrganization) {
      this.buyerOrganization = new Organization(obj.buyerOrganization);
    }
    if (obj.sellerOrganization) {
      this.sellerOrganization = new Organization(obj.sellerOrganization);
    }

    if (obj.buyerBillingEntity) {
      this.buyerBillingEntity = new BillingEntity(obj.buyerBillingEntity);
    }
    if (obj.sellerBillingEntity) {
      this.sellerBillingEntity = new BillingEntity(obj.sellerBillingEntity);
    }
  }

}
