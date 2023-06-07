import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { DateService, RoleService, StringService } from 'src/app/lib/oa/core/services';
import { FieldEditorModel } from 'src/app/lib/oa/core/models';
import { Action } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'oa-table',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.css']
})
export class TableEditorComponent implements OnInit, OnChanges {

  @Input()
  class: string;

  @Input()
  style: any;

  @Input()
  indexTemplate: TemplateRef<any>;

  @Input()
  headerTemplate: TemplateRef<any>;

  @Input()
  rowTemplate: TemplateRef<any>;

  @Input()
  detailsTemplate: TemplateRef<any>;

  @Input()
  footerTemplate: TemplateRef<any>;

  @Input()
  cellTemplate: TemplateRef<any>;

  @Input()
  actionTemplate: TemplateRef<any>;

  @Input()
  editorTemplate: TemplateRef<any>;

  @Input()
  definition: {
    label: string;
    style: {
      container?: any; //{class:string, style:{}}
      header?: any; //{class:string, style:{}}
      value?: any; //{class:string, style:{}}
    };
    fields: FieldEditorModel[]
  }

  @Input()
  items: any = []  // {} || []

  @Input()
  actions: any = {}  // {} || []

  @Input()
  stats: any = {};

  @Input()
  view: 'form' | 'table' = 'form'

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  @Output()
  edited: EventEmitter<any> = new EventEmitter();

  @Input()
  edit: (any) => any;

  @Output()
  saved: EventEmitter<any> = new EventEmitter();

  @Input()
  save: (any) => any;

  @Output()
  canceled: EventEmitter<any> = new EventEmitter();

  @Input()
  cancel: (any) => any;

  @Output()
  removed: EventEmitter<any> = new EventEmitter();

  @Input()
  remove: (any, number) => any;

  errors: any = {};
  isFormSubmit: boolean = false;

  rows: any = [];

  constructor(
    public auth: RoleService,
    private dateService: DateService,
    private stringService: StringService
  ) { }

  ngOnInit(): void {

    this.style = this.definition?.style || {};

    this.createActions();
    // this.setRows()
  }

  ngOnChanges(): void {
    if (!this.definition || !this.definition.fields || !this.definition.fields.length) {
      return
    }
    // this.setRows()
  }

  // setRows() {
  //   this.rows = []

  //   this.items.forEach(item => {
  //     let rowItem = { item: item, columns: this.setField(this.definition, item) }
  //     this.rows.push(rowItem)
  //   })
  // }

  // setField(definition, row) {
  //   let columns = []
  //   definition.fields.forEach(column => {
  //     let columnItem = column
  //     columnItem.value = column.key.split('.').reduce((obj, level) => obj && obj[level], row);
  //     // columnItem['isKeyExists'] = this.checkKeyExists(row, column.key)
  //     columns.push(columnItem)
  //   })

  //   return JSON.parse(JSON.stringify(columns))
  // }


  createActions() {
    let field = this.definition.fields.find(f => f.key === 'action')
    if (!field) { return }

    this.actions = this.actions || {};

    if (Array.isArray(this.actions)) {
      let actions = {};
      this.actions.forEach(action => {
        if (typeof action === 'function') {
          actions[action.name] = {
            code: action.name,
            event: action
          }
        } else {
          actions[action.code] = action;
        }
      });
      this.actions = actions;
    } else {
      for (const code in this.actions) {
        let action = this.actions[code];
        if (typeof action === 'function') {
          this.actions[code] = {
            code: code,
            event: action
          }
        }
      }
    }

    const actions: Action[] = [];

    (field?.config?.actions || []).forEach((action) => {

      if (typeof action === 'string') {
        action = {
          code: action
        };
      }

      if (this.actions[action.code]) {
        action.event = this.actions[action.code].event;
      }

      switch (action.code) {
        case 'edit':
          if (!action.event) {
            action.event = (i) => { this.onEdit(i); };
          }
          break;

        case 'save':
          if (!action.event) {
            action.event = (i) => { this.onSave(i); }
          }
          break;

        case 'cancel':
          if (!action.event) {
            action.event = (i) => { this.onCancel(i); }
          }
          break;

        case 'remove':
          if (!action.event) {
            action.event = (i) => { this.onRemove(i); }
          }
          break;
      }

      action.type = action.type || 'icon';
      action.style = action.style || (action.type === 'icon' ? 'subtle' : 'default');
      actions.push(new Action(action));
    });

    this.actions = actions.filter(i => this.auth.hasPermission(i.permissions));
  }



  checkKeyExists(item, key) {
    let isExists = false;
    if (key.includes('.')) {
      const value = key.split('.').reduce((obj, level) => obj && obj[level], item)
      if (value === undefined) {
        isExists = false;
      } else {
        isExists = true;
      }
    } else {
      isExists = item.hasOwnProperty(key)
    }

    return isExists
  }

  resetError(ms = 5000) {
    setTimeout(() => {
      this.isFormSubmit = false;
      this.errors = {}
    }, ms)
  }

  onReset() {
    // this.init(this.definition.columns);
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

  setData(columns) {
    for (const column of columns) {
      if (typeof column.control === 'object') {
        this.setData(column.control.columns)
      } else {
        this.setValue(this.items, column.key.split('.'), column.value);
      }
    }
  }

  onSubmit(columns) {
    if (this.view === 'table') {
      this.changed.emit(this.items);
      return
    }

    this.isFormSubmit = true;
    setTimeout(() => {
      if (this.errors && Object.keys(this.errors).length && Object.values(this.errors).find(v => v !== undefined && v !== null && v !== '')) {
        this.resetError();
        return;
      }
      this.setData(columns)
      this.changed.emit(this.items);
    }, 0);
  }

  isEmpty(item: any) {
    item = item || {}
    if (!Object.values(item).find(v => v !== undefined || v !== null || v !== '')) {
      return true
    }
    return false
  }

  onEdit(item) {
    item.isEditing = true;
    if (this.edit) { this.edit(item); }
    this.edited.emit(item)
  }

  onSave(item: any) {
    if (!this.isEmpty(item)) {
      item.isEditing = false;
      if (this.save) { this.save(item); }
      this.saved.emit(item);
    }
  }

  onCancel(item: any) {
    item.isEditing = false;
    if (this.cancel) { this.cancel(item); }
    this.canceled.emit(item);
  }

  onRemove(item: any) {
    item.isDeleted = true;
    let index = this.items.findIndex(i => i.isDeleted);
    this.items.splice(index, 1);
    if (this.remove) { this.remove(item, index); }
    this.removed.emit(item);
  }

  getClass(field: FieldEditorModel, item: any) {
    let valueClass = field.style?.value?.class || this.style?.value?.class;

    if (!valueClass || typeof valueClass === 'string') {
      return valueClass || '';
    }

    let value = this.getValue(field, item);
    valueClass = valueClass.find(c => {
      switch (c.operator) {
        case '>':
          return value > c.value || item[c.key1] > item[c.key2];
        case '>=':
          return value >= c.value || item[c.key1] >= item[c.key2];
        case '<':
          return value < c.value || item[c.key1] < item[c.key2];
        case '<=':
          return value <= c.value || item[c.key1] <= item[c.key2];

        case '===':
        case '==':
        case '=':
          return value === c.value || item[c.key1] === item[c.key2];

        case '!==':
        case '!=':
          return value !== c.value || item[c.key1] !== item[c.key2];
      }
    })

    if (valueClass) {
      return valueClass.class;
    }

    return '';
  }

  getStyle(field, item) {

    let valueStyle = field.style?.value?.styles || field.style?.value?.style || this.style?.value?.style || {};

    if (!Array.isArray(valueStyle)) {
      return valueStyle;
    } else if (!valueStyle.length) {
      return {};
    }

    let value = this.getValue(field, item);

    valueStyle = valueStyle.find(c => {
      switch (c.operator) {
        case '>':
          return value > c.value;
        case '>=':
          return value >= c.value;
        case '<':
          return value < c.value;
        case '<=':
          return value <= c.value;

        case '===':
        case '==':
        case '=':
          return value === c.value;

        case '!==':
        case '!=':
          return value !== c.value;
      }
    });
    return valueStyle?.style || {};
  }

  formatValue(field: FieldEditorModel, value: any) {
    if (!field.format) {
      return value;
    }

    switch (field.type) {
      case 'date':
        return this.dateService.date(value).toString(field.format);
      default:
        return value;
    }
  }

  getValue(field: FieldEditorModel, item: any) {
    item = item || {};
    let value = item[field.key];

    if (!value) {
      value = field?.value?.default;
    }

    return this.formatValue(field, value);
  }

  getLabel(field: FieldEditorModel): string | number {
    let value = field.label;

    // if (typeof data === 'string' || typeof data === 'number') {
    //   value = data;
    // } else if (typeof data === 'object') {
    //   if (data.type === 'date') {
    //     let date = moment();
    //     let format = 'DD-MM-YYYY';
    //     if (data.config) {
    //       const period = data.config.period || 'day';
    //       format = data.config.format || format;
    //       if (data.config.subtract) {
    //         date = date.subtract(data.config.subtract, period);
    //       }
    //       if (data.config.add) {
    //         date = date.add(data.config.add, period);
    //       }
    //       if (data.config.startOf) {
    //         date = date.startOf(period);
    //       }
    //       if (data.config.endOf) {
    //         date = date.endOf(period);
    //       }
    //     }
    //     value = date.format(format);
    //   }
    // }

    return value;
  }

  getSummary(field: any) {

    if (!field.summary) {
      return '';
    }

    if (field.summary.value) {
      return field.summary.value;
    }

    let value = this.stats[field.key];
    if (value) {
      return value;
    }

    const numOr0 = (n) => {
      if (isNaN(n)) return 0;

      if (typeof n === 'number') return n;

      return parseFloat(n);
    }

    switch (field.summary.type) {
      case 'sum':
        value = this.items.reduce((t, i) => t + numOr0(i[field.key]), 0);
        break;

      case 'min':
        value = Math.min(...this.items.map(i => numOr0(i[field.key])));
        break;

      case 'max':
        value = Math.max(...this.items.map(i => numOr0(i[field.key])));
        break;

      case 'average':
        value = this.items.reduce((t, i) => t + numOr0(i[field.key]), 0) / this.items.length;
        break;

      case 'count':
        value = this.items.length;
        break;
    }

    return value;
  }

  isCellClickable(field: FieldEditorModel) {
    return !!field?.config?.click;
  }
  onCellClick(field: any, item: any) {

    let config = field?.config?.click || field?.click || {};

    if (config.toggle === 'details') {
      item.isSelected = !item.isSelected;
      return;
    }

    // let click = field.click || {}
    // if (!(click.params || click.config)) {
    //   return;
    // }

    // const obj = this.params || {};

    // for (const param of (click.params || [])) {
    //   if (param.value) {
    //     obj[param.key] = param.value;
    //   } else if (param.field) {
    //     obj[param.key] = item[param.field] || this.params[param.field];
    //   }
    // }

    // this.selected.emit({
    //   dialog: click.dialog,
    //   routerLink: click.routerLink,
    //   params: obj,
    //   config: click.config
    // });
  }
}
