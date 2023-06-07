import { Component, EventEmitter, Input, OnInit, AfterViewInit, Output, TemplateRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UxService } from 'src/app/core/services/ux.service';
import { ReportDataBaseComponent } from 'src/app/lib/oa/insight/components/report-data.base.component';
import { ReportDataService } from 'src/app/lib/oa/insight/services/report-data.service';
import { NavService } from 'src/app/core/services/nav.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ReportParam } from 'src/app/lib/oa/insight/models/report-param.model';
import { take } from 'rxjs/operators';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'insight-report-data',
  templateUrl: './report-data.component.html',
  styleUrls: ['./report-data.component.css']
})
export class ReportDataComponent extends ReportDataBaseComponent {

  @ViewChild('matTable', { static: false })
  set table(matTable: MatTable<any>) {
    if (matTable) {
      this.ngZone.onMicrotaskEmpty.pipe(take(3)).subscribe(() => matTable.updateStickyColumnStyles())
    }
  }

  @Input()
  detailsTemplate: TemplateRef<any>;

  @Input()
  cellTemplate: TemplateRef<any>;

  @Output()
  selected: EventEmitter<any> = new EventEmitter();

  @Input()
  templateParams: ReportParam[] = [];

  constructor(
    api: ReportDataService,
    errorHandler: UxService,
    private navService: NavService,
    private router: Router,
    private ngZone: NgZone
  ) {
    super(api, errorHandler);
  }

  onExpand(item) {
    this.reportType.fields.forEach((column) => {
      if (column?.click && column?.click?.inline) {
        this.onClick(column, item);
      }
    })
  }

  paramsGenerator(obj, paramKey, paramValue): void {
    let container = obj;
    paramKey.split('.').map((k, i, values) => {
      if (obj.hasOwnProperty(k))
        container = (container[k] = (i === values.length - 1 ? paramValue : {}))
    });
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
  setData(fields, obj, data) {

    for (const field of fields) {
      if (field.field) {
        this.setValue(obj, field.key.split('.'), data[field.field]);
      } else if (field.value) {
        this.setValue(obj, field.key.split('.'), field.value);
      }
    }
  }

  onClick(column, item) {
    if (!column.click) {
      return
    }
    var paramObj = {};
    var params = column.click.params || [];
    if (params && params.length) {
      this.setData(params, paramObj, item);
    }

    if (column.click.inline) {
      item.isSelected = !item.isSelected || false
      let filters: ReportParam[] = this.templateParams.filter(filter => filter.value !== undefined) || []
      item.details = {
        template: column.click.template,
        templates: column.click.templates,
        reportType: column.click.reportType || null,
        config: column.click.config,
        params: paramObj,
        filters: (function () {
          if (paramObj) {
            for (let key in paramObj) {
              filters.push(new ReportParam(
                {
                  key: key,
                  value: paramObj[key],
                  valueLabel: key
                }
              ))
            }
          }
          return filters
        })()
      }
      return;
    }

    if (column.template) {
      // let filters: ReportParam[] = this.templateParams.filter(filter => filter.value !== undefined) || []
      item.templateDetails = {
        code: column.template.toLowerCase(),
        config: column.click.config,
        params: paramObj,
        filters: this.templateParams.filter(filter => !!filter.value) || []
      }
      return;
    }


    if (column.click.dialog && column.click.config) {
      this.selected.emit({
        dialog: column.click.dialog,
        routerLink: column.click.routerLink,
        params: paramObj,
        config: column.click.config
      });
    }

    if (column.click.routerLink) {
      if (paramObj['route']) {
        let routerLink = column?.click.routerLink + "/" + paramObj['route'];
        var param = {};
        for (const key in paramObj) {
          if (key !== 'route') {
            param[key] = paramObj[key];
          }
        }
        let url = this.router.createUrlTree([routerLink], { queryParams: param }).toString();
        window.open(`${window.location.origin}/${url}`, '_blank');
      }
      else {
        this.navService.goto(column.click.routerLink, paramObj);
      }
    }
  }

  checkCondition(c, item, column) {
    let value = item[column.key];
    if (c.field) {
      value = item[c.field]
    }
    let types = {}
    this.reportType.fields.forEach((field) => {
      types[field.key] = field.type
    })
    if (c.key1 && c.key2) {
      let type1 = types[c.key1]
      let type2 = types[c.key2]
      if (item[c.key1] && item[c.key2] && type1 !== 'date' && type2 !== 'date') {
        switch (c.operator) {
          case '>':
            return item[c.key1] > item[c.key2]
          case '>=':
            return item[c.key1] >= item[c.key2]
          case '<':
            return item[c.key1] < item[c.key2]
          case '<=':
            return item[c.key1] <= item[c.key2]

          case '===':
          case '==':
          case '=':
            return item[c.key1] === item[c.key2]

          case '!==':
          case '!=':
            return item[c.key1] !== item[c.key2]
        }
      }
      else {
        let d1 = (function () {
          if (c.key1.toLowerCase() === 'today' || item[c.key1] === undefined)
            return new Date()
          return new Date(item[c.key1])
        })()
        let d2 = (function () {
          if (c.key2.toLowerCase() === 'today' || item[c.key2] === undefined)
            return new Date()
          return new Date(item[c.key2])
        })()
        switch (c.operator) {
          case '>':
            return d1 > d2
          case '>=':
            return d1 >= d2
          case '<':
            return d1 < d2
          case '<=':
            return d1 <= d2

          case '===':
          case '==':
          case '=':
            return d1 === d2

          case '!==':
          case '!=':
            return d1 !== d2

        }
      }
    }
    else {
      switch (c.operator) {
        case '>':
          return value > c.value
        case '>=':
          return value >= c.value
        case '<':
          return value < c.value
        case '<=':
          return value <= c.value

        case '===':
        case '==':
        case '=':
          return value === c.value

        case '!==':
        case '!=':
          return value !== c.value
      }
    }
  }

  getClass(column, item) {
    let classValue = column.style?.value?.class

    if (!classValue || classValue === undefined || typeof classValue === 'string') {
      return '';
    }

    classValue = classValue.find(c => {

      if (c.conditions) {
        let flag = true
        c.conditions.forEach((condition) => {
          if (this.checkCondition(condition, item, column) === false) { flag = false; }
        })
        return flag
      } else {
        return this.checkCondition(c, item, column)
      }
    })

    if (classValue) {
      return classValue.class;
    }

    return '';
  }

  openColumnFilters(column) {
    this.reportType.fields.map((f) => f.showFilters = false)
    column.showFilters = true;
  }
}
