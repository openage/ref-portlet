import { ErrorHandler, Input, OnChanges, OnDestroy, OnInit, Directive } from '@angular/core';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Organization } from '../models';
import { OrganizationService } from '../services';

@Directive()
export class OrganizationListBaseComponent extends PagerBaseComponent<Organization> implements OnInit, OnDestroy, OnChanges {

  @Input()
  view = 'table';

  @Input()
  type: string;

  @Input()
  from: Date | string;

  @Input()
  to: Date | string;

  @Input()
  user: string;

  @Input()
  name: string;

  @Input()
  status: string;

  @Input()
  params: any;

  columns: string[] = [];

  constructor(
    api: OrganizationService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['type', 'status', 'name', , 'owner', 'from', 'to', 'email', 'phone', 'services', 'rating', 'credit-amount', 'credit-duration', 'text'],
      pageOptions: { limit: 10 },
    });
  }

  ngOnInit() {
    this.columns = ['orgName', 'personName', 'email', 'phone', 'status', 'action'];
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.filters.reset(false);

    if (this.params) {
      Object.keys(this.params).forEach((key) => {
        this.filters.set(key, this.params[key]);
      });
    }

    if (this.name) {
      this.filters.set('name', this.name);
    }
    if (this.type) {
      this.filters.set('type', this.type);
    }
    if (this.status) {
      this.filters.set('status', this.status);
    }
    if (this.from) {
      this.filters.set('from', this.from);
    }
    if (this.to) {
      this.filters.set('to', this.to);
    }
    if (this.user) {
      this.filters.set('owner', this.user);
    }
    this.fetch();
  }

  ngOnDestroy(): void { }

}
