import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FieldEditorModel } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';


@Component({
  selector: 'oa-object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements OnInit, OnChanges {

  @Input()
  definition: {
    label: string;
    style: {
      container?: any; //{class:string, style:{}}
      header?: any; //{class:string, style:{}}
      fields?: any; //{class:string, style:{}}
    };
    fields: FieldEditorModel[]
  }

  @Input()
  value: any = {}  // {} || []

  @Input()
  view: 'form' | 'table' = 'form'

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  @Output()
  save: EventEmitter<any> = new EventEmitter();

  @Output()
  delete: EventEmitter<any> = new EventEmitter();

  errors: any = {};
  isFormSubmit: boolean = false;

  constructor(
    public auth: RoleService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (!this.definition || !this.definition.fields || !this.definition.fields.length || this.view === 'table') return
    this.init(this.definition.fields)
  }

  init(fields): void {
    for (const field of fields) {
      if (typeof field.control === 'object') {
        this.init(field.control.fields)
      } else {
        field.value = this.getValue(this.value, field.key.split('.'));
      }
    }
  }

  getValue(obj, key, i = 0): any {
    if (typeof obj === 'object' && !obj.hasOwnProperty(key[i])) {
      return null
    }

    if (obj[key[i]] && typeof obj[key[i]] === 'object' && !Array.isArray(obj[key[i]])) {
      return this.getValue(obj[key[i]], key, i + 1)
    }

    return JSON.parse(JSON.stringify(obj[key[i]]))
  }

  resetError(ms = 5000) {
    setTimeout(() => {
      this.isFormSubmit = false;
      this.errors = {}
    }, ms)
  }

  onReset() {
    this.init(this.definition.fields);
    this.resetError(0);
  }

  setValue(obj, key, value, i = 0): any {
    if (typeof obj === 'object' && !obj.hasOwnProperty(key[i]) && (i < (key.length - 1))) {
      obj[key[i]] = {}
    }

    if (obj[key[i]] && typeof obj[key[i]] === 'object' && !Array.isArray(obj[key[i]])) {
      return this.setValue(obj[key[i]], key, value, i + 1)
    }

    obj[key[i]] = value
    return
  }

  setData(fields) {
    for (const field of fields) {
      if (typeof field.control === 'object') {
        this.setData(field.control.fields)
      } else {
        this.setValue(this.value, field.key.split('.'), field.value);
      }
    }
  }

  onSubmit(fields) {
    if (this.view === 'table') {
      this.changed.emit(this.value);
      return
    }

    this.isFormSubmit = true;
    setTimeout(() => {
      if (this.errors && Object.keys(this.errors).length && Object.values(this.errors).find(v => v !== undefined && v !== null && v !== '')) {
        this.resetError();
        return;
      }
      this.setData(fields)
      this.changed.emit(this.value);
    }, 0);
  }
}
