import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Organization } from 'src/app/lib/oa/directory/models';
import { Designation } from 'src/app/lib/oa/directory/models/designation.model';
import { DesignationService } from 'src/app/lib/oa/directory/services/designation.service';

@Component({
  selector: 'directory-designation-picker',
  templateUrl: './designation-picker.component.html',
  styleUrls: ['./designation-picker.component.css'],
})
export class DesignationPickerComponent implements OnInit, OnChanges {

  @Input()
  view: 'old' | 'new' = 'old'

  @Input()
  organization: Organization;

  @Input()
  value: Designation;

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

  @Input()
  params: any;

  @Output()
  changed: EventEmitter<Designation> = new EventEmitter();

  @ViewChild('userInput')
  userInput: ElementRef<HTMLInputElement>;

  @ViewChild('designationPicker')
  matAutocomplete: MatAutocomplete;

  control = new UntypedFormControl();

  isEditing = false;

  items: Designation[];

  constructor(
    public api: DesignationService
  ) {
    if (this.view === 'old') {
      this.control.valueChanges.pipe(
        debounceTime(300),
        switchMap((value) => this.api.search({
          'name': value,
          'organization-code': this.organization ? this.organization.code : ''
        }))
      ).subscribe((page) => {
        this.items = page.items;
      });
    }
  }

  ngOnInit() {
    if (this.view === 'old') {
      this.userInput.nativeElement.value = this.displayEmployee(this.value);
    } else if ((this.view === 'new') && !this.value) {
      this.value = new Designation()
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
      this.value = new Designation()
    }
  }

  displayEmployee(department?: Designation): string | undefined {
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

    this.userInput.nativeElement.value = this.displayEmployee(this.value);
    this.control.setValue(null);
  }

  noOption($event) {
    if (!this.items.length) {
      const designation = new Designation({ name: $event.target.value });
      this.changed.emit(designation);
    }
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
    if (!this.value) { this.value = new Designation(); }
  }

}
