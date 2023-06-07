import { Entity, IUser, ModelBase } from '../../core/models';
import { BillingEntity } from './billing-entity.model';
import { Organization } from './organization.model';
import { Invoice } from './invoice.model';

export class Voucher extends ModelBase {
    amount: number;
    currency: {
        name: string,
        code: string
    };

    isPayable: boolean;
    isAdvance: boolean;
    entity: Entity;
    type: string;

    date: Date;
    dueDate: Date;
    paidDate: Date;

    billToCustomer: boolean;
    remarks: string;

    user: IUser;
    invoice: Invoice;

    sellerOrganization: Organization;
    sellerBillingEntity: BillingEntity;

    buyerOrganization: Organization;
    buyerBillingEntity: BillingEntity;

    constructor(obj?: any) {
        super(obj);
        if (!obj) {
            return;
        }

        this.code = obj.code;
        this.amount = obj.amount;
        this.currency = obj.currency;

        this.entity = obj.entity;
        this.isPayable = obj.isPayable;
        this.isAdvance = obj.isAdvance;

        this.type = obj.type;
        this.date = obj.date;
        this.dueDate = obj.dueDate;
        this.paidDate = obj.paidDate;

        this.status = obj.status;
        this.meta = obj.meta;

        this.remarks = obj.remarks;
        this.billToCustomer = obj.billToCustomer;


        if (obj.invoice) {
            this.invoice = new Invoice(obj.invoice);
        }

        if (obj.sellerOrganization) {
            this.sellerOrganization = new Organization(obj.sellerOrganization);
        }

        if (obj.sellerBillingEntity) {
            this.sellerBillingEntity = new BillingEntity(obj.sellerBillingEntity);
        }

        if (obj.buyerOrganization) {
            this.buyerOrganization = new Organization(obj.buyerOrganization)
        }

        if (obj.buyerBillingEntity) {
            this.buyerBillingEntity = new BillingEntity(obj.buyerBillingEntity)
        }
    }

}
