import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from '../../core/structures';
import { Contractor } from '../models';
import { ContractorService } from '../services/contractor.service';

@Directive()
export class NewContractorBaseComponent extends DetailBase<Contractor> implements OnInit, OnChanges {

    Contractor = new Contractor();

    constructor(
        private api: ContractorService,
        private errorHandler: ErrorHandler
    ) {
        super({ api, errorHandler });
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit() {
    }
}
