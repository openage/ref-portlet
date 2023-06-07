import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { RoleType } from 'src/app/lib/oa/directory/models';
import { RoleTypeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-role-type-picker',
  templateUrl: './role-type-picker.component.html',
  styleUrls: ['./role-type-picker.component.css'],
})
export class RoleTypePickerComponent implements OnInit, OnChanges {

  @Input()
  roleType: RoleType;

  @Input()
  placeholder: string;

  @Input()
  label: string;

  @Input()
  usercode: string;

  @Input()
  reset = false;

  @Input()
  readonly = false;

  @Input()
  required = false;

  @Output()
  changed: EventEmitter<RoleType> = new EventEmitter();

  @ViewChild('userInput')
  userInput: ElementRef<HTMLInputElement>;

  @ViewChild('roleTypePicker')
  matAutocomplete: MatAutocomplete;

  control = new UntypedFormControl();

  isEditing = false;

  items: RoleType[];

  constructor(
    private employeeService: RoleTypeService
  ) {

    this.control.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => this.employeeService.search({ name: typeof value === 'string' ? value : '' }))
    ).subscribe((page) => {
      this.items = page.items;
    });
  }

  ngOnInit() {
    if (this.userInput) {
      this.userInput.nativeElement.value = this.displayEmployee(this.roleType);
    }
  }

  ngOnChanges() {
    if (this.usercode === 'my') {
      this.readonly = true;
      this.required = false;
    }
    if (this.reset) {
      this.roleType = null;
    }
  }

  displayEmployee(department?: RoleType): string | undefined {
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
    this.roleType = event.option.value;

    this.changed.emit(this.roleType);

    this.userInput.nativeElement.value = this.displayEmployee(this.roleType);
    this.control.setValue(null);
  }

  validate(): boolean {
    return true;
  }
  complete(): Observable<any> | boolean {
    return true;
  }
}
