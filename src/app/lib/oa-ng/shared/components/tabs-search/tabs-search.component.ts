import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { PageOptions } from 'src/app/lib/oa/core/models/page-options.model';
import { GenericApi } from 'src/app/lib/oa/core/services/generic-api';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { ReportParam } from 'src/app/lib/oa/insight/models';
import { SearchOptions } from '../../models/search-options.model';

@Component({
  selector: 'oa-tabs-search',
  templateUrl: './tabs-search.component.html',
  styleUrls: ['./tabs-search.component.css']
})
export class TabsSearchComponent implements OnInit, OnChanges {

  tabs: any[] = [];

  @Input()
  options: SearchOptions | any;

  param: ReportParam;

  timer: any;

  count: any;

  constructor(
    private http: HttpClient,
    public auth: RoleService,
    private uxService: UxService
  ) { }

  ngOnInit(): void {
    this.filterTabs();
  }

  ngOnChanges() {
    this.filterTabs();
  }

  filterTabs() {
    this.options = new SearchOptions(this.options);
    this.param = this.options.params.find((p) => p.control === 'tabs');
    this.tabs = this.param?.config?.tabs;
    if (this.param?.config?.stats) {
      if (this.param.config.stats.value) {
        this.getTabs(this.param, this.param.config.stats.value);
      } else {
        this.getTabStats(this.param).subscribe((stats) => {
          this.getTabs(this.param, stats);
        });
      }
    } else if (this.param?.config?.url) {
      this.getTabs(this.param);
    } else if (this.param?.config?.tabs || this.param?.config?.items || this.param?.config?.options || this.param?.options) {
      this.tabs = this.param.config.tabs || this.param.config.items || this.param.config.options || this.param.options;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.tabs.length) {
        if (this.param.value) {
          this.onSelectValue(this.param.value);
        } else {
          this.onSelectValue(this.tabs[0].value);
        }
      }
    }
  }

  getTabs(param: ReportParam, stats?: any) {
    if (param.config.tabs) {
      this.tabs = [];
      param.config.tabs.forEach((item) => {
        if (!stats) {
          this.tabs.push({
            label: item.name || item.label,
            key: param.key,
            value: item.code || item.value,
          });
        } else if (stats[item.code || item.statKey || item.value]) {
          this.tabs.push({
            label: item.name || item.label,
            key: param.key,
            value: item.code || item.value,
            stat: stats[item.code || item.statKey || item.value]
          });
        }
      });

      if (this.timer) {
        clearTimeout(this.timer);
      }
      // this.onSelectValue(this.tabs[0]?.value);
      return
    }
    const api = new GenericApi<any>(this.http, param.config.url.code, {
      collection: param.config.url.addOn,
      auth: this.auth
    }).search();
    api.subscribe((page) => {
      this.tabs = [{
        label: 'All',
        key: param.key,
        value: '',
        stat: this.count
      }];
      page.items.forEach((item) => {

        if (!stats) {
          this.tabs.push({
            label: item.name,
            key: param.key,
            value: item.code,
          });
        } else if (stats[item.code]) {
          this.tabs.push({
            label: item.name,
            key: param.key,
            value: item.code,
            stat: stats[item.code]
          });
        }

      });
      if (this.tabs && this.tabs.length) {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        // this.onSelectValue(this.tabs[0]?.value);
      }
    });
  }

  getTabStats(param: ReportParam) {
    const subject = new Subject<any>();

    const api = new GenericApi<any>(this.http, 'insight', {
      collection: 'reportTypes',
      auth: this.auth
    });
    const pageOptions = new PageOptions({});
    pageOptions.path = `${param.config.stats.code}/data`;
    if (param.config.stats.options) {
      if (param.config.stats.options.assignee === 'my') {
        param.config.stats.options.assignee = this.auth.currentUser().email;
      }
    }
    api.search(param.config.stats.options, pageOptions).subscribe((page) => {
      if (page.items && page.items.length) {
        subject.next(page.items[0]);
      } else {
        subject.next({});
      }
    });
    return subject.asObservable();
  }

  onSelectValue(event: string) {
    this.param.value = event;
    let query = {};
    query[this.param.key] = event;
    this.uxService.onTabSelect.emit(query)
  }

}
