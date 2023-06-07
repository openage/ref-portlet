import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { UxService } from 'src/app/core/services';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { PageOptions } from '../../core/models';
import { Organization } from '../models';
import { OrganizationService } from '../services';

export class OrganizationListBaseComponent extends PagerBaseComponent<Organization> implements OnInit, OnChanges, OnDestroy {

  @Input()
  readonly = false;

  @Input()
  code: string;

  @Input()
  name: string;

  @Input()
  status = 'active';

  @Input()
  type: string;

  constructor(
    private api: OrganizationService,
    private errorHandler: UxService
  ) {
    super({
      api,
      errorHandler,
      filters: [
        'name',
        'code',
        'type',
        'status'
      ]
    });
  }

  ngOnInit() {
    this.fetch().subscribe();
  }

  ngOnChanges() {
    this.filters.reset(false);
    if (this.code) {
      this.filters.set('code', this.code);
    }
    if (this.status) {
      this.filters.set('status', this.status);
    }
    if (this.name) {
      this.filters.set('name', this.name);
      this.filters.set('status', 'all');
    }
    if (this.type) {
      this.filters.set('type', this.type);
    }
    this.fetch().subscribe();
  }

  refresh() {
    this.filters.reset(false);
    if (this.code) {
      this.filters.set('code', this.code);
    }
    if (this.status) {
      this.filters.set('status', this.status);
    }
    if (this.name) {
      this.filters.set('name', this.name);
      this.filters.set('status', 'all');
    }
    if (this.type) {
      this.filters.set('type', this.type);
    }
    this.fetch().subscribe();
  }

  ngOnDestroy(): void {
  }

  public toggle(item: Organization, event: MatSlideToggleChange) {
    if (item.status === 'active') {
      item.status = 'inactive';
    } else {
      item.status = 'active';
    }
    this.api.update(item.id, item).subscribe(() => {
      this.fetch().subscribe();
    });
  }

}
