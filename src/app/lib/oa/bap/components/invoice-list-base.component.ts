import { SelectionModel } from '@angular/cdk/collections';
import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import * as moment from 'moment';
import { Entity } from '../../core/models';
import { PagerBaseComponent } from '../../core/structures';
import { Invoice } from '../models/invoice.model';
import { InvoiceService } from '../services/invoice.service';

@Directive()
export class InvoiceListBaseComponent extends PagerBaseComponent<Invoice> implements OnInit, OnChanges {

    @Input() isPayable: boolean;
    @Input() invoiceNumber: string;
    @Input() entity: Entity;
    @Input() status: string;
    @Input() type: string;
    @Input() buyerOrganization: any;
    @Input() sellerOrganization: any;
    @Input() pageSize: number = 10;
    @Input() fromDate: string;
    @Input() toDate: string;
    @Input() columns: string[] = ['date', 'invoiceReceiveDate', 'invoiceNumber', 'jobNumber', 'supplier', 'amount', 'dueDate', 'status', 'navigation'];
    selection = new SelectionModel<Invoice>(true, []);

    constructor(
        api: InvoiceService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 10
            },
            filters: ['status', 'code', 'type', 'isPayable', 'entity-id', 'entity-type', 'entity-name', 'buyerOrganization', 'sellerOrganization', 'fromDate', 'toDate']
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.filters.reset(false);
        this.search();
    }

    ngOnInit(): void {
    }

    search(): void {
        this.filters.reset(false);

        if (this.invoiceNumber) {
            this.filters.set('code', this.invoiceNumber);
        }

        if (this.status) {
            this.filters.set('status', this.status);
        }

        if (this.entity) {
            if (this.entity.id) {
                this.filters.set('entity-id', this.entity.id);
            }
            if (this.entity.type) {
                this.filters.set('entity-type', this.entity.type);
            }
        }

        if (this.buyerOrganization) {
            this.filters.set('buyerOrganization', this.buyerOrganization.code || this.buyerOrganization);
        }

        if (this.sellerOrganization) {
            this.filters.set('sellerOrganization', this.sellerOrganization.code || this.sellerOrganization);
        }

        if (this.type) {
            this.filters.set('type', this.type);
        }

        if (this.isPayable != undefined) {
            this.filters.set('isPayable', this.isPayable);
        }
        if (this.fromDate) {
            this.filters.set('fromDate', moment(this.fromDate).startOf('day').toDate());
        }
        if (this.toDate) {
            this.filters.set('toDate', moment(this.toDate).endOf('day').toDate());
        }

        this.fetch();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean {
        return this.items.every((item) => item.isSelected);
    }

    isAnySelected(): boolean {
        return this.items.some((item) => item.isSelected == true);
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        if (this.isAllSelected()) {
            this.items.forEach((item) => item.isSelected = false);
            return;
        }

        this.items.forEach((item) => item.isSelected = true);
    }

    onRefresh() {
        this.search();
    }

}
