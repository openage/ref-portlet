import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { ValidationService, ErrorService } from 'src/app/core/services';
import { ErrorModel, FieldEditorModel } from 'src/app/lib/oa/core/models';
import { DateService, RoleService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'oa-field-editor',
  templateUrl: './field-editor.component.html',
  styleUrls: ['./field-editor.component.css']
})
export class FieldEditorComponent implements OnInit {
  /**
    item.control: 'autocomplete' | 'input' | 'search-input' | 'text-input' | 'textarea' |
             'inputNumber' | 'selector' | 'select' | 'datePicker' | 'date-picker' |
             'iconToggler' | 'inputToggler' | 'rangeDate' | 'rangeNumber | 'list' = 'input'
  */

  @Input()
  key: string;

  @Input()
  type?: any;

  @Input()
  control: any = 'text';
  // control: 'autocomplete' | 'text' | 'textarea' | 'html' | 'json' | 'number' | 'password' | 'otp' | 'email' | 'phone' | 'date' | 'select' | 'icon' = 'text';

  @Input()
  value?: any | {
    value?: any,
    default?: any,
    key?: string,
    label?: string
  };

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter();

  @Input()
  label: string;

  @Input()
  showLabel?: boolean = true;

  @Input()
  description?: string;

  @Input()
  icon?: string;

  @Input()
  placeholder: string;

  @Input()
  style?: any;

  @Input()
  class?: string;

  @Input()
  permissions?: any[];

  @Input()
  disabled = false;

  @Input()
  readonly = false;

  @Input()
  required = false;

  @Input()
  template?: string;

  @Input()
  format?: any;

  @Input()
  isHidden?: boolean;

  @Input()
  config?: any = {};

  @Input()
  validations?: any[];

  @Input()
  item: FieldEditorModel;

  @Output()
  itemChanged: EventEmitter<any> = new EventEmitter();

  @Input()
  error: ErrorModel;

  @Output()
  errorChange: EventEmitter<ErrorModel>;

  @Input()
  isFormSubmit: boolean = false;

  @Output()
  errored: EventEmitter<ErrorModel> = new EventEmitter();

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  isProcessing = false;

  items: any[] = [];

  options: any = {};

  constructor(
    public auth: RoleService,
    private validator: ValidationService,
    private errorService: ErrorService,
    private dateService: DateService
  ) { }

  ngOnInit(): void {
    if (!this.item) return;

    this.key = this.item.key;
    this.config = this.item.config || {};
    this.config.templates = this.config.templates || {};
    this.config.templates.value = this.config.templates.value || this.config.templateItem || 'default';
    this.config.templates.placeholder = this.config.templates.placeholder || 'default';
    this.items = this.config.items || this.config.options;

    this.type = this.item.type || this.item.config.type;

    this.label = this.item.label;
    this.showLabel = this.item.showLabel !== null || this.item.showLabel !== undefined ? this.item.showLabel : true;

    this.description = this.item.description;
    this.icon = this.item.icon;
    this.placeholder = this.item.placeholder || '';
    this.style = this.item.style;
    this.class = this.item.class || this.item.config.class;
    this.permissions = this.item.permissions;
    this.readonly = this.item.readonly || false;
    this.required = this.item.required || false;
    this.template = this.item.template;
    this.isHidden = this.item.isHidden;

    this.disabled = !this.auth.hasPermission(this.permissions);

    this.format = {}
    if (this.item.format) {
      switch (this.item.format) {
        case 'trim':
          this.format.trim = true;
          break;
        case 'uppercase':
          this.format.casing = 'uppercase';
          break;
      }
    }

    let value = this.value || this.item.value;

    if (value) {
      if (typeof value === 'object') {
        this.value = value.value;
      } else {
        this.value = value
      }
    }

    this.control = 'oa-input';
    this.type = 'text';

    switch (this.item.control) {
      case 'autocomplete':
        this.control = 'oa-autocomplete';
        this.config.search = this.config.search || {}
        this.config.search.field = this.config.search.field || this.config.paramField || 'text';
        this.config.search.params = this.config.search.params || this.config.params;
        break;

      case 'select':
      case 'selector':
      case 'multi-select':
      case 'multi-selector':
      case 'list':
      case 'inputToggler':
        this.control = 'oa-input-selector';
        this.type = 'list';
        break;

      case 'date':
      case 'date-picker':
      case 'datePicker':
        this.options.view = 'date';
        break;

      case 'icon':
      case 'icon-toggler':
      case 'iconToggler':
      case 'showIconOnly':
        this.control = 'oa-icon-toggler';
        break;

      case 'rangeDate':
      case 'date-range':
        this.control = 'oa-input-range';
        this.options.view = 'date';
        break;

      case 'rangeNumber':
      case 'number-range':
        this.control = 'oa-input-range';
        this.options.view = 'number';
        break;

      case 'currencyPicker':
      case 'currency-picker':
      case 'currency':
        this.control = 'oa-unit-picker';
        this.type = 'currency';
        break;
      case 'unitPicker':
      case 'unit-picker':
      case 'unit':
        this.control = 'oa-unit-picker';
        this.type = this.options.type;
        break;

      //  'iconToggler' | 'inputToggler' | 'rangeDate' | 'rangeNumber | 'list' = 'input'
    }

  }

  displayValue = () => {
    return this.value;
  }
  checkValue = (value: string): Observable<any> => {
    const subject = new Subject<any>();
    setTimeout(() => {
      // this.isProcessing = true;
      subject.next(null)
    });

    return subject.asObservable();
  }

  setError($event, key) {
    this.error[key.toLowerCase()] = $event
    this.errored.emit(this.error)
  }

  onAddItem($event, item) {
    item.value = item.value || [];
    item.value = [...item.value, $event.target.value]
    $event.target.value = null;
  }

  onRemoveItem(item, index) {
    item.value.splice(index, 1);
    item.value = [...item.value]
  }

  onValueChange(newValue: any) {
    this.item.value = newValue ? {
      value: newValue.value || newValue,
      label: newValue.label || newValue
    } : null;

    this.value = this.item.value ? this.item.value : undefined;
    this.valueChange.emit(this.value);
    this.itemChanged.emit(this.item)
    this.changed.emit(this.item)
  }

  onAutoCompleteSelect(event) {
    // TODO:  To change the value Use MAPPER in the item and MAP accordinly

    let item = event
    let name = null;

    if (item) {
      delete item.id
      name = item.name
    }

    this.onValueChange({
      value: item,
      label: name
    })
  }

  onInputChange(event: KeyboardEvent) {
    // this.item.value = event.target['value'];
    this.onValueChange({
      value: event.target['value'],
      label: event.target['value']
    });
  }

  onSelectorChange(event) {
    this.onValueChange((typeof event.value === 'object') ? event.value.value : event.value)
  }

  onReportSelectorChange(event) {
    let value: any = {
      value: event.value
    }
    if (event.value) {
      let option = this.item.config.options.filter((op: any) => op.value === event.value);
      value.label = option[0].label;
    }

    this.onValueChange(value);
  }



  setUnit(event) {
    this.item.value = event.code;
    this.onValueChange(this.item.value);
  }

  onToggle(event) {
    this.item.value = event;
    this.onValueChange(this.item.value);
  }

  onRangeChange(event: KeyboardEvent, key: 'from' | 'till') {
    this.item.value[key].value = event.target['value'];

    this.onValueChange(this.item.value);
  }
}
