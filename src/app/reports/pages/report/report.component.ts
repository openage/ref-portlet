import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Report, ReportParam, ReportType } from 'src/app/lib/oa/insight/models';
import { ReportTypeService } from 'src/app/lib/oa/insight/services/report-type.service';
import { ReportService } from 'src/app/lib/oa/insight/services/report.service';
import { InsightWidgetDialogComponent } from 'src/app/core/components/insight-widget-dialog/insight-widget-dialog.component';
import { NavService, UxService } from 'src/app/core/services';
import { Entity, FieldEditorModel } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { Link } from 'src/app/lib/oa/core/structures';
import { QueryBuilderComponent } from 'src/app/lib/oa-ng/shared/components/query-builder/query-builder.component';
import { SearchOptions } from 'src/app/lib/oa-ng/shared/models/search-options.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {

  @ViewChild('queryBuilder')
  queryBuilder: QueryBuilderComponent;

  @ViewChild('widgetDialogColumnTemplate')
  widgetDialogColumnTemplate: TemplateRef<any>

  reportTypeCode: string;
  showFilters = true;
  areaCode: string;

  reportType: ReportType;
  report: Report;

  isProcessing = false;
  filters: FieldEditorModel[] = [];
  columnFilters: FieldEditorModel[] = [];

  isCreating = false;
  isUpdating = false;

  isCurrent = true;
  page: Link;
  dialogRef: any;
  divs: any = {
    meta: {
      divs: [
        {
          "code": "r-1",
          "permissions": [],
          "style": {
            "container": {
              "style": {
                "margin-top": "20px"
              }
            },
            "divs": {
              "class": "flex-row three"
            }
          },
          "divs": [
            {
              "code": "r-1-l"
            },
            {
              "code": "r-1-m"
            },
            {
              "code": "r-1-r"
            }
          ]
        },
        {
          "code": "r-2",
          "permissions": [],
          "style": {
            "container": {
              "style": {
                "margin-top": "20px"
              }
            },
            "divs": {
              "class": "flex-row two"
            }
          },
          "divs": [
            {
              "code": "r-2-l"
            },
            {
              "code": "r-2-r"
            }
          ]
        },
        {
          "code": "r-3",
          "permissions": [],
          "style": {
            "container": {
              "style": {
                "margin-top": "20px"
              }
            },
            "divs": {
              "class": "flex-row two"
            }
          },
          "divs": [
            {
              "code": "r-3-l"
            },
            {
              "code": "r-3-r"
            }
          ]
        }
      ]
    }
  };
  constructor(
    private navService: NavService,
    private uxService: UxService,
    private reportTypeService: ReportTypeService,
    private reportService: ReportService,
    private router: Router,
    private dialog: MatDialog,
    public auth: RoleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register(`/reports/:areaCode/:reportTypeCode`, this.route, (isCurrent, params) => {
      this.areaCode = params.get('areaCode');
      this.reportTypeCode = params.get('reportTypeCode');
      this.fetchReportType(this.reportTypeCode);

      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
    this.uxService.onSearch.subscribe((search) => {
      if (!Object.keys(search).length) { return }
      this.build(search as any)
    })
  }

  ngOnDestroy(): void {
    this.uxService.reset();
    if (!!this.page.subscription) {
      this.page.subscription.unsubscribe();
    }
  }

  setSearchParams(data: SearchOptions[]) {
    this.uxService.setSearchParams(data);
  }

  onStatSelect($event) {
    if ($event.dialog) {
      let filter = this.filters.filter(f => f.value !== undefined)
      if (filter.length) {
        filter.forEach(f => {
          $event.params[f.key] = f.value
        })
      }
      switch ($event.dialog) {
        case 'widget':
          if (this.dialogRef)
            this.dialogRef.close();
          this.dialogRef = this.dialog.open(InsightWidgetDialogComponent, {
            data: $event,
            width: '70%'
          });
          this.dialogRef.componentInstance.columnTemplate = this.widgetDialogColumnTemplate
      }

    } else if ($event.routerLink) {
      if ($event.params['route']) {
        let routerLink = $event.routerLink + "/" + $event.params['route'];
        let url = this.router.createUrlTree([routerLink]).toString();
        window.open(`${window.location.origin}/${url}`, '_blank');
      }
      else {
        this.navService.goto($event.routerLink, $event.params);
      }
    }
  }

  getFilterValue(value) {
    if (typeof value !== 'string')
      return value
    switch (value.toLowerCase()) {
      case 'username':
        return this.auth.currentRole().profile.firstName
      case 'usercode':
        return this.auth.currentRole().code
      case 'useremail':
        return this.auth.currentRole().email
      default:
        return value
    }
  }


  fetchReportType(code) {
    this.isProcessing = true;

    this.reportTypeService.get(code).subscribe((reportType) => {
      this.reportType = reportType;
      let configFilters = this.reportType.filters.map((filter) => {
        if (filter?.config?.injections && filter.config.injections.length) {
          filter.config.injections.forEach((filterItem) => {
            if (filterItem.key && filterItem.value && this.auth.hasPermission(filterItem.permissions))
              filter[filterItem.key] = this.getFilterValue(filterItem.value)
          })
          return filter
        } else
          return filter
      })
      this.filters = configFilters.filter(filter => (!filter?.group || filter?.group === 'bar' || filter?.group === undefined));
      this.columnFilters = configFilters.filter(filter => filter?.group === 'column');
      if (this.filters.length && this.filters.every(param => param.control)) {
        const searchFilters = {
          params: this.filters
        };
        this.setSearchParams(searchFilters as any);
      }
      this.build(this.filters);
      this.setContext();
      this.isProcessing = false;
    });
  }

  setContext() {
    let context = this.page.meta.context || [{ code: 'reset' }, { code: 'edit', permission: "system.manage" }, {
      helpCode: this.page.meta.helpCode
    }, 'close'];
    context = context.filter(item => { return this.auth.hasPermission(item.permission) })
    context.forEach((item) => {
      switch (item.code) {
        case 'reset':
          item.event = () => this.resetFilters();
          item.title = 'Reset Filters';
          item.icon = 'mat-restart_alt'
          break;

        case 'filters':
          item.filters = () => this.showFilters = !this.showFilters;
          break;

        case 'edit':
          item.event = () => {
            this.navService.goto('console.report.editor', {
              path: {
                code: this.reportTypeCode
              }
            });
            // window.open(`${environment.links.console}/system/report-types/${this.reportTypeCode}`, '_blank');
          };
          break;
      }
    });

    this.uxService.setContextMenu(context);

  }
  reset() {
    this.filters = null;
  }

  build(params: FieldEditorModel[]) {
    this.filters = [];
    let report: Report;
    report = new Report();
    this.reportType.fields.map((f) => f.showFilters = false)
    report.type = this.reportType;
    this.filters = params;
    params.forEach((param) => {
      let item = this.columnFilters.find(f => f.key === param.key);
      if (item)
        item.value = param.value;
    })
    const uniqueParamsByKey = [
      ...new Map([
        ...this.columnFilters.filter(f => (f.value !== undefined)),
        ...params.filter(f => (f.value !== undefined))
      ].map(item => [item['key'], item])
      ).values()
    ];
    report.params = uniqueParamsByKey;
    this.isCreating = true;
    this.reportService.create(report)
      .subscribe((response) => {
        this.isCreating = false;
        this.report = response;
      });
  }


  resetFilters() {
    if (this.dialogRef)
      this.dialogRef.close();
    this.fetchReportType(this.reportTypeCode);
  }

  selectReport($event: Report) {
    this.report = $event;
  }

  closeReport() {
    this.report = null;
  }

  backClicked() {
    this.navService.back();
  }

  generate() {
    this.reportService.update(this.report.id, { status: 'new' }).subscribe((report) => {
      this.report = report;
      if (this.report.status === 'new' || this.report.status === 'in-progress') {
        setTimeout(() => {
          this.refresh();
        }, 5000);
      }
    });
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
      }
    });
  }

  download() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = this.report.url;
    a.download = this.report.type.code;
    a.click();
    document.body.removeChild(a);
  }

}
