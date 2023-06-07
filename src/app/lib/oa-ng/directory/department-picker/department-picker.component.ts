import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Department, Organization } from 'src/app/lib/oa/directory/models';
import { DepartmentService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-department-picker',
  templateUrl: './department-picker.component.html',
  styleUrls: ['./department-picker.component.css']
})
export class DepartmentPickerComponent implements OnInit, OnChanges {

  @Input()
  view: 'old' | 'new' = 'old'

  @Input()
  organization: Organization;

  @Input()
  value: Department;

  @Input()
  readonly = false;

  @Input()
  required = false;

  @Input()
  placeholder: string;

  @Input()
  label: string;

  @Input()
  reset = false;

  @Input()
  usercode: string;

  @Input()
  params: any;

  @Output()
  changed: EventEmitter<Department> = new EventEmitter();

  @ViewChild('userInput')
  userInput: ElementRef<HTMLInputElement>;

  @ViewChild('departmentPicker')
  matAutocomplete: MatAutocomplete;

  control = new UntypedFormControl();

  isEditing = false;

  items: Department[];

  constructor(
    public api: DepartmentService
  ) {
    if (this.view === 'old') {
      this.control.valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => this.api.search({ 'name': value, 'organization-code': this.organization ? this.organization.code : '' }))
      ).subscribe((page) => {
        this.items = page.items;
      });
    }
  }

  ngOnInit() {
    if (this.view === 'old') {
      this.userInput.nativeElement.value = this.display(this.value);
    } else if ((this.view === 'new') && !this.value) {
      this.value = new Department()
    }
  }

  ngOnChanges() {
    if (this.usercode === 'my') {
      this.readonly = true;
      this.required = false;
    }
    if (this.reset) {
      this.value = null;
    }
    if ((this.view === 'new') && !this.value) {
      this.value = new Department()
    }
  }

  display(department?: Department): string | undefined {
    if (!department) {
      return '';
    }

    if (typeof department === 'string') {
      return department;
    }

    if (!department.name || !department.name) {
      return department.code;
    }

    return `${department.name}`;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.value = event.option.value;

    this.changed.emit(this.value);

    this.userInput.nativeElement.value = this.display(this.value);
    this.control.setValue(null);
  }

  noOption($event) {
    if (!this.items.length) {
      const department = new Department({ name: $event.target.value });
      this.changed.emit(department);
    }
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
    if (!this.value) { this.value = new Department(); }
  }

}
