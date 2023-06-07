import { Component, ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Directive } from '@angular/core';
import { PagerBaseComponent, PagerModel } from 'src/app/lib/oa/core/structures';
import { FieldEditorModel } from '../../core/models';
import { Report, ReportType } from '../models';
import { ReportDataService } from '../services/report-data.service';

@Directive()
export class ReportDataBaseComponent extends PagerBaseComponent<any> implements OnInit, OnChanges {

  @Input()
  report: Report;

  @Input()
  reportType: ReportType;

  @Input()
  columnFilters: FieldEditorModel[] = []

  @Input()
  query: any;

  @Input()
  refreshSeconds = 0;

  @Input()
  view: 'table' | 'grid' | 'bars' | 'pie' = 'table';


  hidePaginator: boolean = false;

  // @Output()
  // onClose: EventEmitter<any> = new EventEmitter<any>();

  // page: PagerModel<any>;

  headArray = [];

  summary: any = {};

  constructor(

    // private reportService: ReportService,
    api: ReportDataService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      filters: ['reportId'],
      errorHandler,
      pageOptions: { limit: 10 }
    });
    // this.reportTypeCode = this.route.snapshot.paramMap.get('reportTypeCode');

  }
  ngOnInit(): void {
    let handler = false
    this.reportType.fields.forEach((element) => {
      if (!element.isHidden) {
        this.headArray.push(element.key);
        if (this.columnFilters.length) {
          element.filters = this.columnFilters.filter(filter => !filter.isHidden && filter.group.key === element.key)
        }
      }
      if (element?.click && element?.click?.inline) {
        handler = true;
      }
    });
    // if (this.reportType?.type?.provider?.code === 'aggregator')
    //   this.hidePaginator = true

    if (handler)
      this.headArray.push("handler")

    // if (this.report.status === 'new' || this.report.status === 'in-progress') {
    //   setTimeout(() => {
    //     this.refresh();
    //   }, 5000);
    // }
    this.currentPageNo = 1;
    this.getData();
  }

  ngOnChanges(): void {
    // this.getData();
  }

  getData() {
    this.isProcessing = true;
    this.filters.properties['reportId'].value = this.report.id;
    this.fetch().subscribe(() => {
      this.isProcessing = false;
      this.report.items = this.items.length;
      if (this.stats) {
        Object.keys(this.stats).forEach((key) => {
          this.summary[key] = this.stats[key];
        });

        this.summary.hasValue = true;
      }
    });

    if (this.refreshSeconds) {
      setTimeout(() => {
        this.getData();
      }, this.refreshSeconds * 1000);
    }
  }

  // close() {
  //   this.report = null;
  //   this.onClose.emit()
  // }

  // generate() {
  //   this.reportService.update(this.report.id, { status: 'new' }).subscribe(report => {
  //     this.report = report
  //     if (this.report.status === 'new' || this.report.status === 'in-progress') {
  //       setTimeout(() => {
  //         this.refresh();
  //       }, 5000);
  //     }
  //   })
  // }

  // autoRefresh() {
  //   setTimeout(() => {
  //     this.getData();
  //   }, 15000);
  // }

  // refresh() {
  //   if (!this.report) {
  //     return;
  //   }
  //   this.reportService.get(this.report.id).subscribe(report => {
  //     this.report = report
  //     if (this.report.status === 'new' || this.report.status === 'in-progress') {
  //       setTimeout(() => {
  //         this.refresh();
  //       }, 5000);
  //     }
  //   })
  // }

  // download() {
  //   const a = document.createElement('a');
  //   document.body.appendChild(a);
  //   a.href = this.report.url;
  //   a.download = this.report.type.code;
  //   a.click();
  //   document.body.removeChild(a);
  // }
}
