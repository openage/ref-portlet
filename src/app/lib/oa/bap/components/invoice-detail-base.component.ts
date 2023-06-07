import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { Entity } from '../../core/models';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { PagerBaseComponent } from '../../core/structures';
import { Invoice } from '../models/invoice.model';
import { InvoiceService } from '../services/invoice.service';

@Directive()
export class InvoiceDetailBaseComponent extends PagerBaseComponent<Invoice> implements OnInit, OnChanges {

    @Input() type: 'receivable' | 'payable'
    @Input() invoiceNumber:string;
    @Input() entity: Entity;
    @Input() status: string;
    @Input() selectedCustomer:string;
    @Input() buyerOrganization: any;
    @Input() sellerOrganization: any;

    constructor(
        api: InvoiceService,
        errorHandler: ErrorHandler,
        local: LocalStorageService
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 5
            },
            local,
            filters: ['status', 'unbilled','customer' , 'paid', 'approved', 'entity-id', 'entity-type', 'entity-name', 'buyerOrganization', 'sellerOrganization']
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
        this.filters.reset(false);
        if(this.selectedCustomer){
            this.filters.set('customer', this.selectedCustomer)
        }
        if(this.invoiceNumber){
            this.filters.set('invoice', this.invoiceNumber);
        }
        if (this.status) {
            // console.log("filters are setting the status",this.status);
            this.filters.set('status', this.status);
          }
        if (this.entity) {
            this.filters.set('entity-id', this.entity.id);
            this.filters.set('entity-type', this.entity.type);
            this.filters.set('entity-name', this.entity.name);
        }

        if (this.buyerOrganization) {
            this.filters.set('buyerOrganization', this.buyerOrganization.code);
        }
        if (this.sellerOrganization) {
            this.filters.set('sellerOrganization', this.sellerOrganization.code);
        }

        this.fetch();
    }
}
