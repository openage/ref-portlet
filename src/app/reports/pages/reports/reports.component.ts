import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { ReportType } from 'src/app/lib/oa/insight/models';
import { ReportAreaService } from 'src/app/lib/oa/insight/services/report-area.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {

  areaCode: string;

  isCurrent = true;
  page: Link;

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private reportAreaService: ReportAreaService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.navService.register(`/reports/:areaCode`, this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      this.setArea(params.get('areaCode'));
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
    if (!!this.page.subscription) {
      this.page.subscription.unsubscribe();
    }
  }

  onSelect($event: ReportType) {
    this.navService.goto(`/reports/${this.areaCode}/${$event.code}`);
  }

  setArea(code: string) {
    this.areaCode = code;
    this.reportAreaService.get(this.areaCode).subscribe((a) => {
      this.navService.setLabel(this.page, a.name);
    });
  }

  setContext() {
  }

}
