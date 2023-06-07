import {
  Directive,
  ErrorHandler,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import * as moment from 'moment';
import { UxService } from 'src/app/core/services';
import { WidgetDataService } from 'src/app/lib/oa/core/services';
import { PageOptions } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { ReportParam } from 'src/app/lib/oa/insight/models';


@Directive()
export abstract class InsightWidgetBaseComponent implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  view: string;

  @Input()
  canvasId: string;

  @Input()
  canvasHeight: string;

  @Input()
  canvasWidth: string;

  @Input()
  params: any;

  @Input()
  fields: any[];

  @Input()
  style: any; // maps to report-type.widget.style

  @Input()
  type: any;

  @Input()
  config: any;

  @Input()
  refreshSeconds = 0;

  @Input()
  options: PageOptions;

  @Output()
  selected: EventEmitter<any> = new EventEmitter();

  @Input()
  email = '';

  @Input()
  fitlers: ReportParam[] = [];

  @Input()
  items: any[] = [];

  @Input()
  version: any;

  @Input()
  columnTemplate: TemplateRef<any>;

  stats: any = {};

  isProcessing = false;
  dataReceiving: boolean = false;

  @Input()
  hideDetails = true;

  get api(): WidgetDataService {
    return this.injector.get(WidgetDataService);
  }

  get auth(): RoleService {
    return this.injector.get(RoleService);
  }

  get errorHandler(): ErrorHandler {
    return this.injector.get(UxService);
  }

  afterInitialization: () => void;
  afterProcessing: () => void;

  clipboard: string;

  constructor(
    private injector: Injector
  ) { }

  ngOnInit(): void {
    if (this.config && this.config.rows && this.config.rows.collapse) {
      this.hideDetails = true;
    }
  }

  generateKeyLabel(data: any): string | number {
    let value = data;

    if (typeof data === 'string' || typeof data === 'number') {
      value = data;
    } else if (typeof data === 'object') {
      if (data.type === 'date') {
        let date = moment();
        let format = 'DD-MM-YYYY';
        if (data.config) {
          const period = data.config.period || 'day';
          format = data.config.format || format;
          if (data.config.subtract) {
            date = date.subtract(data.config.subtract, period);
          }
          if (data.config.add) {
            date = date.add(data.config.add, period);
          }
          if (data.config.startOf) {
            date = date.startOf(period);
          }
          if (data.config.endOf) {
            date = date.endOf(period);
          }
        }
        value = date.format(format);
      }
    }

    return value;
  }

  isEmpty(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  setInputs() {
    this.type.config = this.type.config || {};
    this.code = this.code || this.type.code;
    this.fields = this.fields || this.type.fields || [];
    this.params = this.params || this.type.config.params || {};
    this.view = this.type.config.view || this.view;
    const widget = this.type.widget || {};
    this.config = this.config || widget.config || {};
    this.canvasId = this.canvasId || this.config.canvasId;
    this.canvasHeight = this.canvasHeight || this.config.canvasHeight;
    this.canvasWidth = this.canvasWidth || this.config.canvasWidth;

    if (this.config.rows && this.config.rows.collapse === false) {
      this.hideDetails = false;
    }

    if (!this.style && !this.isEmpty(widget.style)) {
      this.style = widget.style;
    }

    this.fields = this.fields.map((field) => {
      field.label = this.generateKeyLabel(field.label);
      field.key = this.generateKeyLabel(field.key);
      return field;
    });
  }

  ngOnChanges(changes): void {
    this.isProcessing = false;

    if (changes.type && changes.type.firstChange) {
      this.setInputs();
    }

    if (changes.version && !changes.version.firstChange) {
      this.items = [];
    }

    this.getData();
  }

  getDateByString(value: string) {
    switch (value.toLowerCase()) {
      case 'bod':
        return moment().startOf('date').toDate();
      case 'eod':
        return moment().endOf('date').toDate();

      case 'bold':  // beginning of last day or yesterday
        return moment().subtract(1, 'day').startOf('day').toDate();
      case 'eold':  // end of last day or yesterday
        return moment().subtract(1, 'day').startOf('day').toDate();

      case 'bow':
        return moment().startOf('week').toDate();
      case 'eow':
        return moment().endOf('week').toDate();

      case 'bom':
        return moment().startOf('month').toDate();
      case 'eom':
        return moment().endOf('month').toDate();

      case 'bolm':
        return moment().subtract(1, 'month').startOf('month').toDate();
      case 'eolm':
        return moment().subtract(1, 'month').endOf('month').toDate();

      case 'boy':
        return moment().startOf('year').toDate();
      case 'eoy':
        return moment().endOf('year').toDate();
      default:
        return value;
    }
  }

  getValue(field: any, item: any) {
    item = item || {};
    let value = item[field.key];

    if (!value) {
      value = field.defaultValue;
    }

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

  remap(items: any[], transform: any) {
    const data = items[0] || {};
    const rows = [];

    let remapped = false;

    (this.fields || []).forEach((item) => {
      let loopCount = 0;

      if (item.keys && item.keys.length) {
        loopCount = item.keys.length;
      }

      if (item.values && item.values.length) {
        loopCount = item.values.length;
      }

      if (loopCount) {
        remapped = true;
      }

      for (let i = 0; i < loopCount; i++) {
        const row = rows[i] || {};
        row[item.key] = !!item.keys ? data[item.keys[i]] : item.values[i];
        if (!rows[i]) {
          rows.push(row);
        }
      }
    });

    if (remapped) {
      return rows;
    }

    return items;
  }

  transpose(items: any[], transform: any): any[] {
    const rows = [];

    transform.config.rows.forEach((item) => {
      (item.values || []).forEach((value, index) => {
        const row = rows[index] || {};
        row[item.key] = value;
        if (!rows[index]) {
          rows.push(row);
        }
      });
    });

    for (const item of items) {
      (transform.config.rows.filter((r) => r.value) || []).forEach((r, i) => {
        const row = rows[i] || {};
        row[item[r.key]] = item[r.value];
        if (!rows[i]) {
          rows.push(row);
        }
      });
    }

    return rows;
  }

  getData() {

    if (!this.code) {
      return;
    } else {
      if (this.afterInitialization) {
        this.afterInitialization();
      }
    }

    this.params = Object.assign({}, this.params);

    for (let key in this.params) {
      if (this.params[key] === 'me' || this.params[key] === 'my') {
        this.params[key] = key === 'roleId' ? this.auth.currentRole().id : this.auth.currentUser().email;
      }
    }


    if (this.params['day'] && typeof this.params['day'] === 'string') {
      this.params['day'] = this.getDateByString(this.params['day']);
    }
    if (this.params['week'] && typeof this.params['week'] === 'string') {
      this.params['week'] = this.getDateByString(this.params['week']);
    }

    if (this.params['month'] && typeof this.params['month'] === 'string') {
      this.params['month'] = this.getDateByString(this.params['month']);
    }

    if (this.params['from']) {
      if (typeof this.params['from'] === 'string') {
        this.params['from'] = this.getDateByString(this.params['from']);
      } else {
        this.params['from'] = this.generateKeyLabel(this.params['from']);
      }
    }

    if (this.params['to']) {
      if (typeof this.params['to'] === 'string') {
        this.params['to'] = this.getDateByString(this.params['to']);
      } else {
        this.params['to'] = this.generateKeyLabel(this.params['to']);
      }
    }

    if (this.params['date'] && typeof this.params['date'] === 'string') {
      this.params['date'] = this.getDateByString(this.params['date']);
    }
    if (this.params['member'] && this.params['member'] === 'my') {
      this.params['member'] = this.auth.currentUser().email;
    }
    if (this.params['assignee'] && this.params['assignee'] === 'my') {
      this.params['assignee'] = this.auth.currentUser().email;
    }

    this.fitlers = this.fitlers || this.type.filters || [];
    this.fitlers.forEach((param) => {
      if (this.params.hasOwnProperty(param.key)) {
        this.params[param.key] = param.value || this.params[param.key];
      }
    });

    const filters = { ...this.params };

    this.options = this.options || new PageOptions({});
    this.api.data(this.code, filters, this.options).subscribe(
      (p) => {
        let transforms = [{ type: 'remap' }];
        if (this.type && this.type.config && this.type.config.data && this.type.config.data.transforms) {
          transforms = this.type.config.data.transforms;
        }

        transforms.forEach((transform) => {
          switch (transform.type) {
            case 'remap':
              this.items = this.remap(p.items, transform);
              break;
            case 'transpose':
              this.items = this.transpose(p.items, transform);
              break;
          }
        });

        if (this.type && this.type.config && this.type.config.clipboard && this.type.config.clipboard.length) {
          this.addToClipBoard(this.type.config.clipboard)
        }

        this.stats = p.stats || {};

        this.isProcessing = false;
        if (this.afterProcessing) {
          this.afterProcessing();
        }
      },
      (err) => {
        this.isProcessing = false;
        this.errorHandler.handleError(err);
      }
    );

    if (this.refreshSeconds) {
      setTimeout(() => {
        this.getData();
      }, this.refreshSeconds * 1000);
    }
  }

  addToClipBoard(clipboard) {
    let str = ''
    this.items.forEach((item, i) => {
      let sub = ''
      clipboard.forEach((c) => {
        sub = `${sub} ${c.prefix}${item[c.key]}${c.sufix}`
      })

      str = `${str} ${i + 1}. ${sub}\n`
    })
    this.clipboard = str
  }

  getStyle(entity, value): any {
    const style = {};
    switch (entity) {
      case 'status':
        switch (value) {
          case 'present':
            style['color'] = '#28d716';
            break;
          case 'absent':
            style['color'] = '#db4d6b';
            break;
        }
    }
    return style;
  }

  formatValue(entity, value): any {
    switch (entity) {
      case 'status':
        switch (value) {
          case 'present':
            value = value[0].toUpperCase() + value.slice(1);
            break;
          case 'absent':
            value = value[0].toUpperCase() + value.slice(1);
            break;
        }
    }
    return value;
  }

  getClass(column, item) {
    let classValue = column.style?.value?.class || this.style?.value?.class;

    if (!classValue || typeof classValue === 'string') {
      return classValue || '';
    }

    let value = this.getValue(column, item);
    classValue = classValue.find(c => {
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

    if (classValue) {
      return classValue.class;
    }

    return '';
  }

  getColumnStyle(column, item) {
    let columnStyle = column.style?.value?.styles

    if (!columnStyle && !column.style?.value?.style && !this.style?.value?.style) {
      return {};
    }

    let value = this.getValue(column, item);
    if (columnStyle && columnStyle.length)
      columnStyle = columnStyle.find(c => {
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
      })

    if (columnStyle) {
      return columnStyle.style;
    }

    return column.style?.value?.style || this.style?.value?.style || {};
  }


  getClickable(column) {
    if (!column.click) {
      return false
    }
    else if (column.style?.value?.style?.condition && column.click) {
      return false
    }
    else {
      return true
    }
  }

  onValueSelect(column, item) {

    let click = column.click || {}
    if (!(click.params || click.config)) {
      return;
    }

    const obj = this.params || {};

    for (const param of (click.params || [])) {
      if (param.value) {
        obj[param.key] = param.value;
      } else if (param.field) {
        obj[param.key] = item[param.field] || this.params[param.field];
      }
    }

    this.selected.emit({
      dialog: click.dialog,
      routerLink: click.routerLink,
      params: obj,
      config: click.config
    });
  }

  onSummarySelect(column) {
    if (!column.summary || !column.click || !column.click.params ||
      !column.click.params.length) {
      return;
    }

    const obj = {};
    for (const param of column.click.params) {
      if (param.value) {
        obj[param.key] = param.value;
      }
    }

    const summary = column.summary;
    if (summary.click && summary.click.params && summary.click.params.length) {
      for (const param of summary.click.params) {
        if (param.value) {
          obj[param.key] = param.value;
        }
      }
    }

    this.selected.emit({
      routerLink: column.click.routerLink,
      queryParams: obj
    });

  }

}
