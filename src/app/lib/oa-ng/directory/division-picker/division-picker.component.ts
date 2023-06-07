import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Division } from 'src/app/lib/oa/directory/models';
import { DivisionService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-division-picker',
  templateUrl: './division-picker.component.html',
  styleUrls: ['./division-picker.component.css']
})
export class DivisionPickerComponent implements OnInit, OnChanges {

  @Input()
  value: Division;

  @Input()
  usercode: string;

  @Input()
  label: string;

  @Input()
  readonly = false;

  @Input()
  required = false;

  @Input()
  placeholder: string;

  @Input()
  reset = false;

  @Output()
  changed: EventEmitter<Division> = new EventEmitter();

  @ViewChild('userInput')
  userInput: ElementRef<HTMLInputElement>;

  @ViewChild('divisionPicker')
  matAutocomplete: MatAutocomplete;

  control = new UntypedFormControl();

  isEditing = false;

  items: Division[];

  constructor(
    private employeeService: DivisionService
  ) {

    this.control.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => this.employeeService.search({ name: value }))
    ).subscribe((page) => {
      this.items = page.items;
    });
  }

  ngOnInit() {
    if (this.usercode !== 'my') {
      this.userInput.nativeElement.value = this.displayEmployee(this.value);
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
  }

  displayEmployee(division?: Division): string | undefined {
    if (!division) {
      return '';
    }

    if (typeof division === 'string') {
      return division;
    }

    if (!division.name || !division.name) {
      return division.code;
    }

    return `${division.name}`;
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.value = event.option.value;

    this.changed.emit(this.value);

    this.userInput.nativeElement.value = this.displayEmployee(this.value);
    this.control.setValue(null);
  }
}
