import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Directive } from '@angular/core';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Department } from '../models';
import { DepartmentService } from '../services';

@Directive()
export class DepartmentListBaseComponent extends PagerBaseComponent<Department> implements OnInit, OnDestroy, OnChanges {

    @Input()
    readonly = false;

    @Input()
    status: string;

    @Input()
    name: string;

    @Input()
    code: string;

    @Input()
    sort = 'code';

    constructor(
        api: DepartmentService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: { limit: 10 },
            filters: ['name', 'status', 'code'],
        });
    }

    ngOnInit() {
        this.fetch();
    }

    ngOnChanges(): void {
        // this.filters.set('status', this.status);
        this.filters.set('name', this.name);
        this.filters.set('code', this.code);
        this.fetch();
    }

    ngOnDestroy(): void {
    }
}
