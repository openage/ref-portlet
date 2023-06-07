import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive, EventEmitter, Output } from '@angular/core';
import { Entity } from '../../core/models';
import { PagerBaseComponent } from '../../core/structures';
import { Payment } from '../models/payment.model';
import { PaymentService } from '../services/payment.service';

@Directive()
export class PaymentListBaseComponent extends PagerBaseComponent<Payment> implements OnInit, OnChanges {

    @Input() type: string;
    @Input() code: string;
    @Input() showCheckbox: boolean;
    @Input() invoiceNumber: string;
    @Input() status: string;
    @Input() organization: any;
    @Input() invoice: string;
    @Input() fromDueDate: Date;
    @Input() toDueDate: Date;
    @Input() fromDate: Date;
    @Input() toDate: Date;
    @Input() fromAmount: string;
    @Input() toAmount: string;
    @Input() entityId: string;
    @Input() entity: Entity;
    @Input() columns: string[] = ['checkBox', 'invoiceType', 'invoiceNumber', 'orderCustomer', 'paymentRegion', 'billToCustomer', 'requestedDate', 'bank', 'gstNumber', 'supplier', 'requestedAmount', 'tds', 'totalAmount', 'transactionId', 'paymentDate', 'status', 'navigation'];
    @Input() isPayable: boolean = true;
    @Input() transactionId: string;
    @Output() onChecked: EventEmitter<Payment> = new EventEmitter<Payment>();

    constructor(
        api: PaymentService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 10
            },
            filters: ['isPayable', 'status', 'entity-id', 'entity-type', 'entity-name', 'organization', 'date', 'toDate', 'fromDate', 'fromDueDate', 'toDueDate', 'fromAmount', 'toAmount', 'invoice', 'type', 'transactionId']
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
        this.filters.set('isPayable', this.isPayable);
        if (this.invoiceNumber) {
            this.filters.set('invoice', this.invoiceNumber);
        }
        if (this.organization) {
            this.filters.set('organization', this.organization)
        }
        if (this.fromDueDate) { this.filters.set('fromDueDate', this.fromDueDate) }
        if (this.toDueDate) { this.filters.set('toDueDate', this.toDueDate) }
        if (this.fromDate) { this.filters.set('fromDate', this.fromDate) }
        if (this.toDate) { this.filters.set('toDate', this.toDate) }
        if (this.fromAmount) { this.filters.set('fromAmount', this.fromAmount) }
        if (this.toAmount) { this.filters.set('toAmount', this.toAmount) }

        if (this.code) {
            this.filters.set('code', this.code);
        }
        if (this.status) {
            this.filters.set('status', this.status);
        }
        if (this.invoice) {
            this.filters.set('invoice', this.invoice);
        }
        if (this.entityId) {
            this.filters.set('entity-id', this.entityId)
        }
        if (this.entity) {
            this.filters.set('entity-id', this.entity.id);
            this.filters.set('entity-type', this.entity.type);
            this.filters.set('entity-name', this.entity.name);
        }

        if (this.transactionId) { this.filters.set('transactionId', this.transactionId) }

        this.fetch();
    }
}
