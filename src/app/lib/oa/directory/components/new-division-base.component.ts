import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from '../../core/structures';
import { Division } from '../models';
import { DivisionService } from '../services';

@Directive()
export class NewDivisionBaseComponent extends DetailBase<Division> implements OnInit, OnChanges {

    division = new Division();

    constructor(
        private api: DivisionService,
        private errorHandler: ErrorHandler
    ) {
        super({ api, errorHandler });
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit() {
    }
}
