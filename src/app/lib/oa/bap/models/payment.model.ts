import { Entity, IUser, ModelBase } from '../../core/models';
import { BankDetail } from './bank-detail.model';
import { BillingEntity } from './billing-entity.model';
import { Invoice } from './invoice.model';
import { Organization } from './organization.model';

export class Payment extends ModelBase {
    date: Date;
    amount: number;
    unsettledAmount: number;

    currency: {
        name: string,
        code: string
    };

    entity: Entity;
    isPayable: boolean;
    isAdvance: boolean;
    billToCustomer: boolean;

    dueDate: Date;  // Due date of payment
    transactionId: string;  // UTM number in case of online
    paidDate: Date; // Actual date of payment
    remarks: string;
    status: string;
    bankDetail: BankDetail;
    mode: string;
    tags: string[];
    meta: any;
    tds: number;
    invoices: {
        isSelected?: boolean;
        remarks: string;
        amount: number,
        invoice: Invoice
    }[];

    payingUser: IUser;
    payingOrganization: Organization;
    payingBillingEntity: BillingEntity;

    receivingUser: IUser;
    receivingOrganization: Organization;
    receivingBillingEntity: BillingEntity;

    constructor(obj?: any) {
        super(obj);
        if (!obj) {
            return;
        }

        this.id = obj.id;
        this.code = obj.code;
        this.remarks = obj.remarks;
        this.paidDate = obj.paidDate;
        this.dueDate = obj.dueDate;
        this.transactionId = obj.transactionId;
        this.tds = obj.tds;
        this.amount = obj.amount;
        this.currency = obj.currency;
        this.unsettledAmount = obj.unsettledAmount;
        this.date = obj.date;
        this.bankDetail = obj.bankDetail;
        this.entity = obj.entity;
        this.isPayable = obj.isPayable;
        this.isAdvance = obj.isAdvance;
        this.billToCustomer = obj.billToCustomer;
        this.mode = obj.mode;

        this.tags = obj.tags;
        this.status = obj.status;
        this.meta = obj.meta;

        if (obj.invoices?.length) {
            this.invoices = obj.invoices.map(item => {
                return {
                    amount: item.amount,
                    invoice: new Invoice(item.invoice),
                    remarks: item.remarks
                }
            })
        } else {
            this.invoices = [];
        }

        this.payingUser = new IUser(obj.payingUser);
        this.payingOrganization = new Organization(obj.payingOrganization);
        this.payingBillingEntity = new BillingEntity(obj.payingBillingEntity);

        this.receivingUser = new IUser(obj.receivingUser);
        this.receivingOrganization = new Organization(obj.receivingOrganization);
        this.receivingBillingEntity = new BillingEntity(obj.receivingBillingEntity);
    }
}
