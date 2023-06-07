import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from '../../core/structures';
import { Designation } from '../models';
import { DesignationService } from '../services';

@Directive()
export class NewDesignationBaseComponent extends DetailBase<Designation> implements OnInit, OnChanges {

    designation = new Designation();

    constructor(
        private api: DesignationService,
        private errorHandler: ErrorHandler
    ) {
        super({ api, errorHandler });
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit() {
    }
}
