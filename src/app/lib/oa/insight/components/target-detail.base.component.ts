import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from '../../core/structures';
import { Target } from '../models/target.model';
import { TargetService } from '../services/target.service';

@Directive()
export class TargetDetailBaseComponent extends DetailBase<Target> implements OnInit, OnChanges {

    @Input()
    code: string;

    @Input()
    readonly: boolean;

    constructor(
        api: TargetService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler
        });
    }

    ngOnInit(): void {
        if (this.code && this.code !== 'new') {
            this.getData();
        } else {
            this.new();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    getData() {
        this.get(this.code);
    }

    new() {

    }
}
