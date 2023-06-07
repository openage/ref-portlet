import { Directive, ErrorHandler, Input, OnChanges, OnInit } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Workflow } from '../models/workflow.model';
import { WorkflowsService } from '../services';

@Directive()
export class WorkflowDetailsBaseComponent extends DetailBase<Workflow> implements OnInit, OnChanges {

    @Input()
    code: string;

    @Input()
    readonly: boolean;

    constructor(
        api: WorkflowsService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler
        });
    }

    ngOnInit(): void {
        if (this.code) {
            this.getData();
        }
    }

    ngOnChanges(): void {
    }

    getData() {
        this.get(this.code);
    }

}
