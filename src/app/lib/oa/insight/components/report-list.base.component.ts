import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Report, ReportType } from '../models';
import { ReportService } from '../services/report.service';

@Directive()
export class ReportListBaseComponent extends PagerModel<Report> implements OnInit, OnChanges {

  @Input()
  reportType: ReportType;

  constructor(
    api: ReportService,
    errorHandler: ErrorHandler
  ) {

    super({
      api,
      pageOptions: { limit: 10 },
      errorHandler,
      filters: ['typeId']
    });
  }

  getReportLists() {
    if (this.reportType) {
      this.filters.properties['typeId'].value = this.reportType.id;
    }
    this.fetch();
  }
  ngOnInit() {
    this.getReportLists();
  }

  ngOnChanges() {
    this.getReportLists();
  }

  download(url, reportType) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = reportType;
    a.click();
    document.body.removeChild(a);
  }
}
