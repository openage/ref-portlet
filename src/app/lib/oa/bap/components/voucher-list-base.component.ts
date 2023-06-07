import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { Entity } from '../../core/models';
import { PagerBaseComponent } from '../../core/structures';
import { Voucher } from '../models/voucher.model';
import { VoucherService } from '../services/voucher.service';

@Directive()
export class VoucherListBaseComponent extends PagerBaseComponent<Voucher> implements OnInit, OnChanges {

    @Input() organization: any;
    @Input() code: string;
    @Input() status: string;
    @Input() invoiceCode: string;
    @Input() entity: Entity;
    @Input() customer: string;
    @Input() jobNumber: string;
    @Input() sellerOrganization: string;
    @Input() buyerOrganization: string;

    @Input() billingEntity: any;

    @Input() columns: string[] = ['jobNumber', 'vendor', 'customer', 'requestedAmount', 'priority', 'invoice', 'billToCustomer', 'expectedDate', 'paymentDate', 'gstNumber', 'totalAmount', 'status', 'navigation'];

    constructor(
        api: VoucherService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 10
            },
            filters: ['code', 'invoice', 'sellerOrganization', 'buyerOrganization', 'entity-id', 'entity-type', 'entity-name', 'status', 'customer']
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.filters.reset(false);
        this.search();
    }

    ngOnInit(): void {
        this.search();
    }

    search(): void {
        if (this.code) {
            this.filters.set('code', this.code);
        }
        if (this.sellerOrganization) {
            this.filters.set('sellerOrganization', this.sellerOrganization)
        }
        if (this.buyerOrganization) {
            this.filters.set('buyerOrganization', this.buyerOrganization)
        }
        if (this.status) {
            this.filters.set('status', this.status);
        }
        if (this.invoiceCode) {
            this.filters.set('invoice', this.invoiceCode);
        }
        if (this.jobNumber) {
            this.filters.set('entity-id', this.jobNumber);
        }
        if (this.customer) {
            this.filters.set('customer', this.customer);
        }
        if (this.entity) {
            this.filters.set('entity-id', this.entity.id);
            this.filters.set('entity-type', this.entity.type);
            this.filters.set('entity-name', this.entity.name);
        }
        this.fetch();
    }
}
