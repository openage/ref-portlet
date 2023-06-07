import { Directive, ErrorHandler, Input, OnChanges, OnInit } from '@angular/core';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Workflow } from '../models/workflow.model';
import { WorkflowsService } from '../services/workflows.service';

@Directive()
export class WorkflowListBaseComponent extends PagerModel<Workflow> implements OnInit, OnChanges {

    @Input()
    name: string;

    @Input()
    code: string;

    @Input()
    columns = ['name', 'code', 'view'];

    afterProcessing: () => void;

    constructor(
        api: WorkflowsService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 10
            },
            filters: ['name', 'code']
        });
    }

    ngOnInit(): void {
        // this.refresh();
    }

    ngOnChanges(): void {
        this.refresh();
    }

    refresh() {
        this.filters.reset(false);

        if (this.name !== undefined) {
            this.filters.set('name', this.name);
        }

        if (this.code !== undefined) {
            this.filters.set('code', this.code);
        }

        this.fetch().subscribe(() => { });
    }

}
