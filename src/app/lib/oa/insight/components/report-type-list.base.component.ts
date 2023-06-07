import { Component, ErrorHandler, Input, OnChanges, OnDestroy, OnInit, Directive } from '@angular/core';
import { JobService } from 'src/app/lib/oa/send-it/services';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { ReportArea } from '../models';
import { ReportType } from '../models/report-type.model';
import { ReportTypeService } from '../services/report-type.service';

@Directive()
export class ReportTypeListBaseComponent extends PagerModel<ReportType> implements OnInit, OnChanges {

  @Input()
  area: string | ReportArea;

  @Input()
  readonly: boolean;

  @Input()
  params: any;

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  columns = ['code', 'name', 'status', 'master'];

  constructor(
    api: ReportTypeService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      pageOptions: { limit: 10 },
      filters: ['area', 'type', 'text']
    });
  }
  ngOnInit(): void {
    // this.refresh();
  }

  ngOnChanges(): void {
    this.refresh();
  }

  refresh() {
    if (this.area) {
      if (typeof this.area === 'string') {
        this.filters.properties['area'].value = this.area;
      } else {
        this.filters.properties['area'].value = this.area.code;
      }
    }

    if (this.params) {
      Object.keys(this.params).forEach((key) => {
        this.filters.set(key, this.params[key]);
      });
    }

    this.fetch().subscribe();
  }

}
