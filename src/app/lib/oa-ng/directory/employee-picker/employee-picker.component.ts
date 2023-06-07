import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Employee, Organization } from 'src/app/lib/oa/directory/models';
import { EmployeeService } from 'src/app/lib/oa/directory/services';
import { UxService } from 'src/app/core/services';
import { AutoCompleteOptions } from 'src/app/lib/oa-ng/shared/models/autocomplete-options.model';
import { IUser } from 'src/app/lib/oa/core/models';

@Component({
  selector: 'directory-employee-picker',
  templateUrl: './employee-picker.component.html',
  styleUrls: ['./employee-picker.component.css'],
})
export class EmployeePickerComponent implements OnInit, OnChanges {
  @Input()
  label: string;

  @Input()
  placeholder = 'Select Employee';

  @Input()
  readonly = false;

  @Input()
  skipSubjectStore = false;

  @Input()
  disabled = false;

  @Input()
  required = false;

  @Input()
  view = 'picker';

  @Input()
  value: IUser;

  @Input()
  type: 'employee';

  @Input()
  options: {
    show?: {
      icon?: boolean
    }
  };

  @Output()
  changed: EventEmitter<IUser> = new EventEmitter();

  @Input()
  organization: Organization;

  autocompleteOptions: AutoCompleteOptions;

  constructor(
    public api: EmployeeService,
    public errorHandler: UxService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if (!this.value) {
    //   this.value = new Employee({});
    // }
    // this.value = this.value ? this.value : null;
    this.autocompleteOptions = new AutoCompleteOptions({
      label: this.label,
      placeholder: this.placeholder,
      search: {
        field: 'name',
        params: {
          status: 'active'
        },
        limit: 10,
        skipSubjectStore: this.skipSubjectStore
      },
      displayFn: (value) => {
        return `${value.profile.firstName ? value.profile.firstName : ''} ${value.profile.lastName ? value.profile.lastName : ''}`;
      }
    });
    if (this.organization) {
      this.autocompleteOptions.autoSelect = true;
      this.autocompleteOptions.preFetch = true;
      this.autocompleteOptions.search.params['organization-code'] = this.organization.code;
    }
    if (this.type) {
      this.autocompleteOptions.search.params['type'] = this.type;
    }
  }

  ngOnInit() {
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
  }
}
