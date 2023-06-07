import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { TenantService } from '../../core/services';
import { Tenant } from '../models';

@Directive()
export abstract class TenantDetailsBaseComponent extends DetailBase<Tenant> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly: boolean;

  complete: EventEmitter<any> = new EventEmitter();

  constructor(
    api: TenantService,
    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() { }

  ngOnChanges() {
    this.get(this.code).subscribe((data) => { });
  }

}
