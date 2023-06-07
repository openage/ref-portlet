import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { PagerModel } from '../../core/structures/pager';
import { Target } from '../models';
import { TargetService } from '../services/target.service';

@Directive()
export class TargetListBaseComponent extends PagerModel<Target> implements OnInit, OnChanges {

    @Input()
    view: 'table' | 'grid' = 'table';

    @Input()
    user: string;

    @Input()
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';

    @Input()
    columns: string[] = ['period', 'user', 'achieved', 'target', 'action'];

    @Input()
    type: string;

    constructor(
        api: TargetService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 10
            },
            filters: ['user', 'type', 'period']
        });

        this.updated.subscribe(() => this.refresh());
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.refresh();
    }

    refresh() {
        if (this.user) {
            this.filters.properties['user'].value = this.user;
        }

        if (this.type) {
            this.filters.properties['type'].value = this.type;
        }

        if (this.period) {
            this.filters.properties['period'].value = this.period;
        }

        this.fetch().subscribe();
    }
}
