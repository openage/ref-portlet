import { WidgetDataService } from 'src/app/lib/oa/core/services';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { NavService } from 'src/app/core/services';
import { OrganizationService } from 'src/app/lib/oa/directory/services/organization.service';
import { ReportTypeService } from "src/app/lib/oa/insight/services/report-type.service";
import { ReportType } from 'src/app/lib/oa/insight/models';
import { Router } from '@angular/router';
import { FieldEditorModel } from 'src/app/lib/oa/core/models';

@Component({
  selector: 'app-insight-widget-dialog',
  templateUrl: './insight-widget-dialog.component.html',
  styleUrls: ['./insight-widget-dialog.component.css']
})
export class InsightWidgetDialogComponent implements OnInit {

  isProcessing = false;

  title = 'Details'

  @Input()
  config: any = {};

  @Input()
  params = [];

  reportTypes: ReportType[] = [];
  divs: any = [
    {
      code: 'default'
    }
  ]



  constructor(
    private router: Router,
    private uxService: UxService,
    private navService: NavService,
    private reportTypeService: ReportTypeService,
    private orgnaizationService: OrganizationService,
    public dialogRef: MatDialogRef<InsightWidgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.config = data.config || this.config;
    this.params = data.params || this.params;
    this.data = {}
  }

  ngOnInit(): void {
    this.isProcessing = true;
    this.config = this.config || {};
    this.config.reportType = this.config.reportType || {};
    this.params = this.params || this.config.filters;

    this.reportTypeService.get(this.config.reportType.code).subscribe((t) => {
      t.container = t.container || {};
      t.container.code = 'default';
      for (var key in this.params) {
        t.filters.push(new FieldEditorModel({
          'key': key,
          'label': key,
          'value': this.params[key],
          'valueLabel': key
        }));
      }
      this.reportTypes = [t];
      this.title = t.widget.title || this.title;
      this.isProcessing = false;
    });
  }

  onSelect() {
    this.dialogRef.close()
  }

  onStatSelect($event) {
    if ($event.routerLink) {
      let url: string;
      let params: any = {};
      let options: any = {};
      if ($event.url) {
        url = $event.url;
      } else if ($event.routerLink) {

        if (typeof $event.routerLink === 'string') {
          url = this.router.createUrlTree([$event.routerLink]).toString();
        } else {
          url = this.router.createUrlTree($event.routerLink).toString();
        }
      }

      if ($event.params) {
        options.newTab = $event.params.newTab;
        if ($event.params.route) {
          url = `${url}/${$event.params.route}`;
          options.newTab = true;
        }

        if ($event.params.path) {
          params.path = $event.params.path
        }

        if ($event.params.query) {
          params.query = $event.params.query
        } else {
          params.query = $event.params
        }
      }

      if (options.newTab) {
        window.open(`${window.location.origin}/${url}`, '_blank');
      } else {
        this.dialogRef.close();
        this.navService.goto(url, params, options);
      }
    }
  }
}
