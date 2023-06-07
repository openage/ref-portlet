import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { PagerBaseComponent } from '../../core/structures';
import { Organization } from '../models/organization.model';
import { Subscription } from '../models/subscription.model';
import { SubscriptionService } from '../services/subscription.service';

@Directive()
export class SubscriptionListBaseComponent extends PagerBaseComponent<Subscription> implements OnInit, OnChanges {

    @Input() code: string;

    @Input() status: string;

    @Input() name: string;

    @Input() organization: Organization;

    @Input() columns: string[] = ['planName', 'date', 'amount', 'duration', 'status'];

    constructor(
        api: SubscriptionService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 5
            },
            filters: ['organization-code', 'name', 'status', 'code']
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
        if (this.status) {
            this.filters.set('status', this.status);
        }

        if (this.name) {
            this.filters.set('name', this.name);
        }

        if (this.code) {
            this.filters.set('code', this.code);
        }

        if (this.organization) {
            if (this.organization.code) {
                this.filters.set('organization-code', this.organization.code);
            } else if (this.organization.id) {
                this.filters.set('organization-id', this.organization.id);
            }
        }

        this.fetch();
    }

    refresh() {
        this.search();
    }
}
