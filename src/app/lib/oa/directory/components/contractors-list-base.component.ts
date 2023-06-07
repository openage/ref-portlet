import { ErrorHandler, Input, OnChanges, OnDestroy, OnInit, Directive } from '@angular/core';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Contractor } from '../models';
import { ContractorService } from '../services/contractor.service';

@Directive()
export class ContractorsListBaseComponent extends PagerBaseComponent<Contractor> implements OnInit, OnDestroy, OnChanges {

  @Input()
  readonly = false;

  @Input()
  status: string;

  @Input()
  name: string;

  @Input()
  sort = 'code';

  constructor(
    api: ContractorService,
    errorHandler: ErrorHandler) {
    super({
      api,
      errorHandler,
      filters: ['name', 'status'],
    });
  }

  ngOnInit() {
    this.fetch();
  }

  ngOnChanges(): void {
    // this.filters.set('status', this.status);
    this.filters.set('name', this.name);
    this.fetch();
  }

  ngOnDestroy(): void { }
}
