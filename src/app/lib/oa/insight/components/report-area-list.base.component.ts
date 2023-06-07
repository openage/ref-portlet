import { Component, ErrorHandler, Input, OnChanges, OnDestroy, OnInit, Directive } from '@angular/core';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { ReportArea } from '../models';
import { ReportAreaService } from '../services/report-area.service';

@Directive()
export class ReportAreaListBaseComponent extends PagerModel<ReportArea> implements OnInit, OnChanges {

  @Input()
  showHidden = false;

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  constructor(
    api: ReportAreaService,
    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler, filters: ['isHidden'] });
  }
  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(): void {
    // this.refresh();
  }

  refresh() {
    this.filters.properties['isHidden'].value = this.showHidden;
    this.fetch();
  }

}
