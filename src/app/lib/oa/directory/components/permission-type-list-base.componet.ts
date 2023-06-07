import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Directive } from '@angular/core';
import { PagerBaseComponent, PermissionGroup } from 'src/app/lib/oa/core/structures';
import { PermissionGroupService } from '../services';

@Directive()
export class PermissionTypeListBaseComponent extends PagerBaseComponent<PermissionGroup> implements OnInit, OnDestroy, OnChanges {

  @Input()
  readonly = false;

  @Input()
  sort = 'code';

  @Input()
  name: any;

  @Input()
  code: string;

  constructor(
    api: PermissionGroupService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['name', 'code'],
      pageOptions: {
        limit: 10,
      },
    });
  }

  ngOnInit() {
    this.fetch();
  }

  ngOnChanges() {
    this.filters.reset(false);
    if (this.name) {
      this.filters.set('name', this.name);
    }
    if (this.code) {
      this.filters.set('code', this.code);
    }
    this.fetch();
  }

  onSelect(item: PermissionGroup) {
    this.selected.emit(item);
  }

  ngOnDestroy(): void {
  }

  terminate(roleType: PermissionGroup) {
    // TODO:
  }
}
