import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Directive } from '@angular/core';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { RoleType } from '../models';
import { RoleTypeService } from '../services';

@Directive()
export class RoleTypeListBaseComponent extends PagerBaseComponent<RoleType> implements OnInit, OnDestroy, OnChanges {

  @Input()
  readonly = false;

  @Input()
  sort = 'code';

  @Input()
  name: any;

  @Input()
  code: string;

  @Input()
  department: string;

  @Input()
  status: string;

  @Input()
  division: string;

  @Input()
  designation: string;

  @Input()
  contractor: string;

  @Input()
  userTypes: string;

  @Input()
  employeeTypes: string;

  @Input()
  supervisor: string;

  constructor(
    api: RoleTypeService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['name', 'code', 'status'],
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
    if (this.status) {
      this.filters.set('status', this.status);
    }
    this.currentPageNo = 1;
    this.fetch();
  }

  onSelect(item: RoleType) {
    this.selected.emit(item);
  }

  ngOnDestroy(): void {
  }

  terminate(roleType: RoleType) {
    // TODO:
  }
}
