import { Directive, ErrorHandler, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PagerModel } from '../../core/structures/pager';
import { Target, TargetType } from '../models';
import { TargetTypeService } from '../services/target-type.service';

@Directive()
export class TargetTypeListBaseComponent extends PagerModel<TargetType> implements OnInit, OnChanges {

    @Input()
    view: 'table' | 'grid' | 'tabs' = 'tabs';

    @Input()
    selectedType: TargetType;

    @Input()
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';

    @Input()
    type: string;

    constructor(
        api: TargetTypeService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            filters: ['period']
        });

        this.updated.subscribe(() => this.refresh());
        this.fetched.subscribe(() => {
            if (!this.selectedType) {
                this.onSelect(this.items[0]);
            }
        });
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges): void {
        this.refresh();
    }

    refresh() {
        if (this.period) {
            this.filters.properties['period'].value = this.period;
        }

        this.fetch().subscribe();
    }

    onSelect(type): void {
        this.selectedType = type;
        this.selected.emit(this.selectedType);
    }
}
