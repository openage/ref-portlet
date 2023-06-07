import { ThisReceiver } from '@angular/compiler';
import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UxService } from 'src/app/core/services/ux.service';
import { PagerBaseComponent } from '../../core/structures';
import { LineItemType } from '../models/line-item-type.model';
import { LineItemTypeService } from '../services/line-item-type.service';

@Directive()
export class LineItemTypeListBaseComponent extends PagerBaseComponent<LineItemType> implements OnInit, OnChanges, OnDestroy {

    @Input() code: string;

    @Input() status: string;

    @Input() hsnCode: string;

    @Input() view: 'table' | 'tableEditor' = 'table';

    @Input() productType: string;

    @Input() serviceType: string;

    @Input() customerType: string;

    @Input() exim: string;

    @Input() exempted: string;

    lineItems: any[] = [];

    createdSubscription: Subscription;
    updatedSubscription: Subscription;
    fetchedSubscription: Subscription;

    constructor(
        api: LineItemTypeService,
        errorHandler: ErrorHandler,
        public uxService: UxService
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 10
            },
            filters: ['exempted', 'status', 'meta-hsn', 'condition-serviceType',
                'condition-productType', 'condition-customerType', 'condition-exim']
        });

        this.createdSubscription = this.created.subscribe(() => {
            this.uxService.showInfo('Line Item Successfully Created', 'line Item');
            this.mapLineItems();
        })
        this.updatedSubscription = this.updated.subscribe(() => {
            this.uxService.showInfo('Line Item Successfully Updated', 'line Item');
            this.mapLineItems();
        });

        this.fetchedSubscription = this.fetched.subscribe(() => {
            this.mapLineItems();
        })
    }


    ngOnChanges(changes: SimpleChanges): void {
        this.filters.reset(false);
        this.search();
    }

    ngOnInit(): void {
        this.search();
    }

    search(): void {
        if (this.status) {
            this.filters.set('status', this.status);
        }

        if (this.exempted) {
            this.filters.set('exempted', this.exempted);
        }

        if (this.exim) {
            this.filters.set('condition-exim', this.exim);
        }

        if (this.hsnCode) {
            this.filters.set('meta-hsn', this.hsnCode);
        }

        if (this.serviceType) {
            this.filters.set('condition-serviceType', this.serviceType);
        }

        if (this.productType) {
            this.filters.set('condition-productType', this.productType);
        }

        if (this.customerType) {
            this.filters.set('condition-customerType', this.customerType);
        }

        this.fetch();
    }

    mapLineItems(): void {
        this.lineItems = this.items.map((item) => {
            if (item.taxes?.length) {
                for (let type of ['cgst', 'sgst', 'igst', 'ugst']) {
                    let tax = item.taxes.find(t => t.type?.code == type)
                    if (tax) {
                        item[type] = tax.value;
                    }
                }
            }
            return item;
        })
    }

    ngOnDestroy(): void {
        if (!!this.createdSubscription) this.createdSubscription.unsubscribe();
        if (!!this.updatedSubscription) this.updatedSubscription.unsubscribe();
        if (!!this.fetchedSubscription) this.fetchedSubscription.unsubscribe();
    }

}
