import { Component, Input, OnInit } from '@angular/core';
import { Validator } from '@angular/forms';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { ReportParam, ReportType } from 'src/app/lib/oa/insight/models';
import { Report } from 'src/app/lib/oa/insight/models/report';
import { ReportService } from 'src/app/lib/oa/insight/services/report.service';

@Component({
  selector: 'insight-report-download-button',
  templateUrl: './report-download-button.component.html',
  styleUrls: ['./report-download-button.component.css']
})
export class ReportDownloadButtonComponent implements OnInit {

  view: 'in-progress' | 'ready' | 'error';

  report: Report;

  @Input() label = 'Download';

  @Input() type: string;

  @Input() params: ReportParam[];

  @Input() validateFn: () => any;

  constructor(
    private reportService: ReportService,
    private uxService: UxService,
    private auth: RoleService
  ) { }

  ngOnInit() {
  }

  generate() {
    if (this.validateFn) {
      let isValid = this.validateFn();
      if (!isValid) { return; }
    }

    let report: Report;
    report = new Report();
    report.type = new ReportType({ code: this.type });

    report.params = this.params;
    this.view = 'in-progress';
    this.reportService.create(report)
      .subscribe((response) => {
        this.report = response;

        this.reportService.update(this.report.id, { status: 'new' }).subscribe((report) => {
          this.report = report;
          this.handleProgress()
          // this.refresh();
        });

      }, (err) => {
        this.view = 'error';
        this.reset();
      });
  }

  handleProgress() {
    const item = {
      id: this.report.id,
      name: `${this.auth.currentTenant().code}-${this.type}`,
      icon: 'file-excel',
      status: this.report.status,
      progress: 0,
      type: 'download',
      api: {
        code: 'insight',
        service: 'reports'
      }
    }

    this.uxService.handleItemProgress(item)
    this.view = null;
  }

  refresh() {
    if (!this.report) {
      return;
    }

    this.reportService.get(this.report.id).subscribe((report) => {
      this.report = report;
      if (this.report.status === 'new' || this.report.status === 'in-progress') {
        setTimeout(() => {
          this.refresh();
        }, 5000);
      } else if (this.report.status === 'ready') {
        // this.view = 'ready';
        this.download();
      } else {
        this.view = 'error';
        this.reset();
      }
    });
  }

  reset(time: number = 5000) {
    setTimeout(() => {
      this.report = null;
      this.view = null;
    }, time);
  }

  download() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = this.report.url;
    a.download = this.report.type.code;
    a.click();
    document.body.removeChild(a);
    this.reset();
  }

}
