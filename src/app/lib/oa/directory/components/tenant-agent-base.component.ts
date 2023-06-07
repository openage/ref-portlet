import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Role, RoleType } from 'src/app/lib/oa/directory/models';
import { DirectoryRoleService } from '../services/directory-role.service';

@Directive()
export class TenantAgentBaseComponent extends PagerBaseComponent<Role> implements OnInit, OnDestroy, OnChanges {

  @Input()
  role: Role;

  @Input()
  readonly = false;

  @Input()
  status: string;

  @Input()
  name: any;

  @Input()
  code: string;

  @Input()
  type: string | RoleType;

  @Input()
  email: string;

  @Input()
  phone: string;

  @Input()
  columns = [];

  @Output()
  selected: EventEmitter<Role> = new EventEmitter();

  constructor(
    api: DirectoryRoleService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['text', 'name', 'code', 'status', 'email', 'phone', 'isAgent', 'roleTypeCode'],
      pageOptions: {
        limit: 10,
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.columns.length) {
      if (this.readonly) {
        this.columns = ['name', 'role', 'email', 'phone'];
      } else {
        this.columns = ['name', 'role', 'email', 'phone', 'action'];
      }
    }

    this.search();
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.filters.reset(false);

    let hasFilter = false;

    if (this.type) {
      this.filters.set('roleTypeCode', [typeof this.type === 'string' ? this.type : this.type.code]);
      hasFilter = true;
    }
    if (this.name) {
      this.filters.set('name', this.name);
      // hasFilter = true;
    }

    if (this.code) {
      this.filters.set('code', this.code);
      hasFilter = true;
    }

    if (this.email) {
      this.filters.set('email', this.email);
      hasFilter = true;
    }

    if (this.phone) {
      this.filters.set('phone', this.phone);
      // hasFilter = true;
    }

    if (!hasFilter) {
      this.filters.set('isAgent', true);
    }

    if (this.status) {
      this.filters.set('status', this.status);
    }

    this.fetch();
  }

  ngOnDestroy(): void {
  }

  onSelect(item: Role) {
    this.selected.emit(item);
  }
}
