import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Directive } from '@angular/core';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Role } from '../models';
import { DirectoryRoleService } from '../services';

@Directive()
export class RoleListBaseComponent extends PagerBaseComponent<Role> implements OnInit, OnDestroy, OnChanges {

  @Input()
  readonly = false;

  @Input()
  sort = 'code';

  @Input()
  name: any;

  @Input()
  text: string;

  @Input()
  userCode: string;

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

  @Input()
  organization: string;

  @Input()
  type: string | string[];

  constructor(
    api: DirectoryRoleService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['text', 'name', 'code', 'status',
        'departments', 'divisions', 'designations',
        'contractors', 'employeeTypes', 'supervisor',
        'userTypes', 'organization', 'roleTypeCode'],
      pageOptions: {
        limit: 10,
      },
    });
  }

  ngOnInit() { }

  ngOnChanges() {
    this.filters.reset(false);
    if (this.name) {
      this.filters.set('name', this.name);
    }
    if (this.text) {
      this.filters.set('text', this.text);
    }
    if (this.userCode) {
      this.filters.set('code', this.userCode);
    }
    if (this.status) {
      this.filters.set('status', this.status);
    }
    if (this.userTypes) {
      this.filters.set('userTypes', this.userTypes);
    }
    if (this.employeeTypes) {
      this.filters.set('employeeTypes', this.employeeTypes);
    }
    if (this.supervisor) {
      this.filters.set('supervisor', this.supervisor);
    }
    if (this.department) {
      this.filters.set('departments', this.department);
    }
    if (this.division) {
      this.filters.set('divisions', this.division);
    }
    if (this.designation) {
      this.filters.set('designations', this.designation);
    }
    if (this.contractor) {
      this.filters.set('contractors', this.contractor);
    }
    if (this.organization) {
      this.filters.set('organization', this.organization);
    }
    if (this.type) {
      this.filters.set('roleTypeCode', this.type);
    }
    this.fetch();
  }

  onSelect(item: Role) {
    this.selected.emit(item);
  }

  ngOnDestroy(): void {
  }

  terminate(role: Role) {
    // TODO:
  }
}
