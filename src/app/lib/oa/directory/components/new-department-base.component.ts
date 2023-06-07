import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from '../../core/structures';
import { Department } from '../models';
import { DepartmentService } from '../services';

@Directive()
export class NewDepartmentBaseComponent extends DetailBase<Department> implements OnInit, OnChanges {

    department = new Department();

    constructor(
        private api: DepartmentService,
        private errorHandler: ErrorHandler
    ) {
        super({ api, errorHandler });
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit() {
    }
}
