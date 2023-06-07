import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Directive } from '@angular/core';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Employee } from '../models';
import { EmployeeService } from '../services';

@Directive()
export class EmployeeListBaseComponent extends PagerBaseComponent<Employee> implements OnInit, OnDestroy, OnChanges {

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
  designations: string;

  @Input()
  contractor: string;

  @Input()
  organization: string;

  @Input()
  userTypes: string;

  @Input()
  type: string;

  @Input()
  employeeTypes: string;

  @Input()
  supervisor: string;

  listColumns = [];

  constructor(
    api: EmployeeService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['name', 'code', 'status', 'type',
        'departments', 'divisions', 'designations', 'designation-name',
        'contractors', 'employeeTypes', 'supervisor', 'organization-code',
        'userTypes'],
      pageOptions: {
        limit: 10,
      },
    });
  }

  ngOnInit() {
    // this.fetch();
  }

  ngOnChanges() {
    if (this.readonly) {
      this.listColumns = ['name', 'email', 'phone', 'designation', 'status'];
    } else if (this.designation) {
      if (this.designation === 'promoters') {
        this.listColumns = ['classShares', 'shareName', 'share', 'holding', 'address', 'pan', 'action'];
      } else if (this.designation === 'director') {
        this.listColumns = ['code', 'directorName', 'directorType', 'address', 'pan', 'action'];
      }
    } else {
      this.listColumns = ['name', 'email', 'phone', 'department', 'designation', 'status', 'action'];
    }
    this.filters.reset(false);
    if (this.name) {
      this.filters.set('name', this.name);
    }
    if (this.code) {
      this.filters.set('code', this.code);
    }
    if (this.organization) {
      this.filters.set('organization-code', this.organization);
    }
    if (this.status) {
      this.filters.set('status', this.status);
    }
    if (this.type) {
      this.filters.set('type', this.type);
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
      this.filters.set('designation-name', this.designation);
    }
    if (this.designations) {
      this.filters.set('designations', this.designations);
    }
    if (this.contractor) {
      this.filters.set('contractors', this.contractor);
    }
    this.fetch();
  }

  onSelect(item: Employee) {
    this.selected.emit(item);
  }

  ngOnDestroy(): void {
  }

  terminate(employee: Employee) {
    // TODO:
  }
}
