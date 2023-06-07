import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UxService } from 'src/app/core/services';
import { FieldEditorModel, PageOptions } from 'src/app/lib/oa/core/models';
import { GenericApi, RoleService } from 'src/app/lib/oa/core/services';
import { Action } from 'src/app/lib/oa/core/structures';
import { FiltersDialogComponent } from '../../dialogs/filters-dialog/filters-dialog.component';
import { SearchOptions } from '../../models/search-options.model';

@Component({
  selector: 'oa-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  view: 'card' | 'bar' | 'column' | 'text' = 'bar';

  @Input()
  class: string;

  @Input()
  style: any;

  @Input()
  options: SearchOptions | any;

  @Input()
  count: any;

  @Input()
  value: any;

  searchClick = true;
  searchText = '';
  isEditing = false;

  params: FieldEditorModel[] = [];
  dropDown: FieldEditorModel[] = [];

  triggers: any = {};

  sorts: any[] = [];

  selectedSort: any;

  tabs: any[] = [];

  type: 'filters' | 'tabbed' | 'full-text' = 'filters';

  @ViewChild('inputContainer')
  inputContainer: ElementRef;

  @Output()
  editing: EventEmitter<boolean> = new EventEmitter();

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  @Output()
  sorted: EventEmitter<any> = new EventEmitter();

  @Output()
  visible: EventEmitter<boolean> = new EventEmitter();

  searchTextChanged = new Subject<string>();

  ddlPosition = 'down';

  ddlWidth = '0px';
  selectedTab: any;

  clear = new Action({
    code: 'clear',
    event: () => {
      this.resetSearch();
    }
  });

  timer;

  subscription: Subscription;

  isShowSearchBar: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: RoleService,
    private http: HttpClient,
    private uxService: UxService,
    public dialog: MatDialog,
  ) {
    let a = 0;
    let recall: string | boolean = true;
    this.subscription = this.route.queryParams.subscribe((query: any) => {
      a = a === 0 ? 1 : 2;
      if (query.recall) {
        recall = query.recall ? query.recall : true
      }
      if (query['fetch'] === 'false') {
        return;
      } else if (a === 1 && (recall === "true" || recall === true)) {
        for (const key in query) {
          this.params.push(new FieldEditorModel({ key, value: query[key] }));
        }
        this.searchByParams();
      } else if (query['search'] && this.searchText !== query['search']) {
        this.searchText = query['search'];
        this.timer = setTimeout(() => this.searchByText(this.searchText));
      } else {
        this.timer = setTimeout(() => this.searchByQuery(query));
      }
    });

    this.uxService.isShowSearchBar.subscribe((isShow) => {
      this.isShowSearchBar = isShow;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.value) {
      this.searchByQuery(this.value);
    }
  }

  ngOnInit() {
    this.uxService.searchChanges.subscribe((options) => {
      this.options = options;
      if (this.options && this.options.params && this.options.params.length > 0) {
        this.visible.emit(true);
      } else {
        this.visible.emit(false);
      }
      this.init();
    });



    this.uxService.onTabSelect.subscribe((selected) => {
      const selectedParamKey = Object.keys(selected)[0];
      this.params.forEach(param => {
        if (param.key === selectedParamKey) {
          param.value = selected[selectedParamKey]
        }
      })
      this.searchByParams();
    })

    this.searchTextChanged.pipe(debounceTime(1000)).subscribe((data) => {
      if (this.view === 'bar' && data !== 'report') {
        this.searchByParams()
      } else {
        this.onSearchReports();
      }
    })

    if (this.view !== 'bar') {
      this.init();
    }

  }

  init() {
    this.options = new SearchOptions(this.options);
    this.options.params = (this.options.params).filter((i) => this.auth.hasPermission(i.permissions));
    this.sorts = this.options.sorts;
    this.selectedSort = this.sorts.find((s) => s.isSelected);
    this.type = this.options.view;

    this.triggers = {};
    this.options.params.forEach((p) => {
      p.placeholder = p.label
      p.showLabel = false;
      p.config = p.config || {};
      p.config.class = this.view === 'bar' ? 'search-input' : ''

      if (p.config && p.config.trigger) {
        this.triggers[p.config.trigger] = p;
      }
    });

    this.renderFilters();

    const tabParam = this.options.tabs || this.options.params.find((p) => p.control === 'tabs');
    if (tabParam) {
      if (tabParam?.config?.stats && this.view !== 'bar') {
        if (tabParam.config.stats.value) {
          this.getTabs(tabParam, tabParam.config.stats.value);
        } else {
          this.getTabStats(tabParam).subscribe((stats) => {
            this.getTabs(tabParam, stats);
          });
        }
      } else if (tabParam?.config?.url) {
        this.getTabs(tabParam);
      } else if (tabParam?.config?.tabs || tabParam?.config?.items || tabParam?.config?.options || tabParam?.options) {
        this.tabs = tabParam.config.tabs || tabParam.config.items || tabParam.config.options || tabParam.options;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        if (this.tabs.length) {
          this.onSelectedTab(this.tabs[0]);
        }
      }
    }
  }

  onSelectedTab(tab: any) {

    const initializing = !this.selectedTab && !tab.value;

    if (!initializing) {
      this.resetSearch();
    }

    this.renderFilters();
    this.selectedTab = tab;
    const param = this.params.find((p) => p.key === this.selectedTab.key);
    param.value = tab.value;

    // if (this.params && this.params.length) {
    //   let param = this.params.find((param) => param.key === this.selectedTab.key);
    //   if (param) {
    //     let index = this.params.indexOf(param);
    //     this.params[index] = this.selectedTab
    //   } else {
    //     this.params.push(this.selectedTab)
    //   }
    // } else {
    //   this.params.push(this.selectedTab)
    // }

    if (!initializing && this.view === 'card') {
      this.searchByParams();
    }
  }

  getTabs(param, stats?) {
    if (param.config.tabs) {
      this.tabs = [];
      param.config.tabs.forEach((item) => {
        if (!stats) {
          this.tabs.push({
            label: item.name,
            key: param.key,
            value: item.code,
          });
        } else if (stats[item.code || item.statKey]) {
          this.tabs.push({
            label: item.name,
            key: param.key,
            value: item.code,
            stat: stats[item.code || item.statKey]
          });
        }
      });

      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.onSelectedTab(this.tabs[0]);
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
        this.onSelectedTab(this.tabs[0]);
      }
    });
  }

  getTabStats(param) {
    const subject = new Subject<any>();

    const api = new GenericApi<any>(this.http, 'insight', {
      collection: 'reportMasters',
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

  setAdvanceSearch() {
    this.getInputDetail();
    this.dropDown = [];
    this.params = [];
    this.options.params.forEach((param: any) => {
      if (param.control !== 'tabs') {
        if (param.group === 'advance' || this.params.length > (this.view !== 'bar' ? 2 : 4)) {
          this.dropDown.push(new FieldEditorModel(param));
        } else {
          if (!this.params.find(p => p.key === param.key)) {
            this.params.push(new FieldEditorModel(param));
          }
        }
      } else {
        if (!this.params.find(p => p.key === param.key)) {
          this.params.push(new FieldEditorModel(param));
        }
      }
    });

    if (this.view === 'bar' && this.dropDown.length) {
      this.pushMoreFilter();
    }

  }

  onFilterSelect(param: FieldEditorModel) {
    const index = this.dropDown.indexOf(param);
    this.dropDown.splice(index, 1);
    this.params.splice(this.params.length - 1, 0, param);
  }

  pushMoreFilter() {
    this.params.push(new FieldEditorModel({
      control: 'selectFilter',
      key: "more",
      label: "More filters",
      options: this.dropDown
    }));
  }

  onMoreFilters() {

    const dialogRef = this.dialog.open(FiltersDialogComponent, {
      width: '50%',
      height: '477px'
    })

    const selectedParams = this.params.filter((param) => {
      if (param.control !== 'tabs') {
        if (param.key !== 'more') {
          return param;
        }
      }
    });

    dialogRef.componentInstance.availableFilters = JSON.parse(JSON.stringify(this.dropDown));
    dialogRef.componentInstance.selectedFilters = selectedParams;

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.params = data.selectedFilters;
        this.dropDown = data.availableFilters;
        this.pushMoreFilter();
      }
    })

  }

  onFieldChange(param: FieldEditorModel) {
    let value = param.value;

    if (value.value) {
      value = value.value;
    }

    switch (param.control) {
      case 'input':
      case 'inputNumber':
      case 'search-input':
      case 'rangeNumber':
        this.searchTextChanged.next(value);
        break;
      case 'text-input':
        this.searchTextChanged.next('report');
        break;
      case 'select':
      case 'date-picker':
        this.onSearchReports()
        break;
      default:
        if (this.view === 'bar') {
          this.searchByParams()
        }
        break;
    }
  }

  // onAutoCompleteSelect(obj, param: FieldEditorModel) {
  //   if (obj) {
  //     let name;
  //     let code;
  //     if (obj.name) { name = obj.name; } else if (obj.profile && obj.profile.firstName) {
  //       name = `${obj.profile.firstName} ${obj.profile.lastName}`;
  //     }
  //     if (param.valueKey && obj[param.valueKey]) {
  //       code = obj[param.valueKey];
  //     } else {
  //       code = obj.code;
  //     }

  //     param.valueLabel = name;
  //     param.value = code;
  //   } else {
  //     param.value = null;
  //     param.valueLabel = null;
  //   }
  //   if (this.view === 'bar') {
  //     this.searchByParams()
  //   }
  // }

  onSelect(item: any, param: FieldEditorModel) {
    if (typeof item === 'string') {
      param.value = {
        label: item,
        value: item
      };
    } else {

      param.value = {
        label: item.label || item.value,
        value: item.value
      };
    }
    if (this.view === 'bar') {
      this.searchByParams()
    }
  }

  // onSelectValue(value, param: FieldEditorModel) {
  //   param.value = value;
  //   if (this.view === 'bar') {
  //     this.searchByParams()
  //   }
  // }

  // onSelectDate(date, param: FieldEditorModel, type?: string) {
  //   if (type === 'from') {
  //     param.range.from.value = date;
  //     param.range.from.valueLabel = moment(date).format('DD-MM-YYYY');
  //   } else if (type === 'till') {
  //     param.range.till.value = date;
  //     param.range.till.valueLabel = moment(date).format('DD-MM-YYYY');
  //   } else {
  //     param.value = date;
  //     param.valueLabel = moment(date).format('DD-MM-YYYY');
  //   }
  //   if (this.view === 'bar') {
  //     this.searchByParams()
  //   }
  // }

  // onSelectDropDown(event: MatSelectChange, param: FieldEditorModel) {
  //   param.value = (typeof event.value === 'object') ? event.value.value : event.value;
  //   if (this.view === 'bar') {
  //     this.searchByParams()
  //   }
  // }

  // onInputKeyUp(event: KeyboardEvent, param: FieldEditorModel) {
  //   param.value = event.target['value'];
  //   this.searchTextChanged.next(event.target['value']);
  // }

  // onRangeChange(event: KeyboardEvent, param: FieldEditorModel, key: 'from' | 'till') {
  //   param.range[key].value = event.target['value'];
  //   this.searchTextChanged.next(event.target['value']);
  // }

  addToParam(param: FieldEditorModel) {
    if (param) {
      if (!this.params.find((p) => p.key === param.key)) {
        this.params.push(param);
      }
    }
  }

  onSort(item) {
    this.selectedSort = item;
    const sort = {};
    sort[item.code] = this.selectedSort.value || item.value;
    this.sorted.emit(sort);
  }

  getInputDetail() {
    setTimeout(() => {
      if (this.inputContainer) {
        const bounds = this.inputContainer.nativeElement.getBoundingClientRect();
        this.ddlWidth = bounds.width;
        this.ddlPosition = bounds.top / window.innerHeight > .5 ? 'up' : 'down';
      }
      // else {
      //   this.getInputDetail();
      // }
    });
  }

  onRemoveParam(param) {
    this.params = this.params.filter((p) => p.key !== param.key);
    this.searchByParams();
  }

  searchByParams() {
    const obj = {};
    this.params.forEach((param) => {
      if (param.value === undefined) {
        return;
      }
      if (param.type === 'range') {
        obj[`${param.key}From`] = param.value.from;
        obj[`${param.key}Till`] = param.value.till;
        return;
      }

      let value = param.value

      if (typeof value === 'object') {
        value = value.value;
      }

      if (value === undefined) { return; }

      obj[param.key] = typeof value === 'string' ? value.trim() : value;
    });
    this.changed.emit(obj);
    this.uxService.onSearch.emit(obj);
    this.finishEditing();
  }

  resetSearch() {
    this.searchText = '';
    this.params = [];
    this.dropDown = [];
    if (this.route.snapshot.queryParams && this.route.snapshot.queryParams.text) {
      this.route.snapshot.queryParams = { ...this.route.snapshot.queryParams, text: null };
    }
    const query: Params = Object.assign({}, this.route.snapshot.queryParams);
    // this.options.params.forEach((p) => {
    //   if (query[p.key]) {
    //     delete query[p.key];
    //   }
    // });

    this.router.navigate([], { queryParams: query });
    this.changed.emit(query);
    this.finishEditing();
  }

  renderFilters() {
    this.isEditing = true;
    this.editing.emit(this.isEditing);
    this.searchText = '';
    for (const p of this.params) {
      if (!p.value) {
        continue;
      }

      const renderValue = (i) => {
        this.searchText = `${this.searchText}${p.key}:  ${i.label ? i.label : i.value}, `;
      }

      let item = p.value

      if (item.from || item.till) {
        if (item.from) {
          renderValue(item.from);
        }
        if (item.till) {
          renderValue(item.till);
        }
      } else {
        renderValue(item);
      }
    }

    // if (this.searchText) {
    //   this.searchText = this.searchText.substring(0, this.searchText.length - 2);
    // }
    this.setAdvanceSearch();
  }

  finishEditing() {
    this.isEditing = false;
    this.editing.emit(this.isEditing);
  }

  searchByText($event) {
    const text: string = typeof $event === 'string' ? $event : $event.target.value;
    if (!text) {
      return this.resetSearch();
    }
    this.params = [];
    const query: Params = Object.assign({}, this.route.snapshot.queryParams);
    this.options.params.forEach((p) => {
      if (query[p.key]) {
        delete query[p.key];
      }
    });

    const triggers = Object.getOwnPropertyNames(this.triggers);

    for (let p of text.split(',')) {

      p = p.trim();

      const trigger = triggers.find((t) => p.startsWith(t));

      let param;
      let key;
      let value;

      if (trigger) {
        param = this.triggers[trigger];
        key = param.key;
        value = p.substring(trigger.length);

      } else {
        const parts = p.split(':');
        key = parts.length === 1 ? 'text' : parts[0].trim().toLowerCase();
        if (!key) {
          return;
        }

        param = this.options.params.find((o) => o.key.toLowerCase() === key);

        if (!param) {
          param = new FieldEditorModel({ key: key });
        }

        value = parts.length === 1 ? parts[0].trim() : parts[1].trim();
      }

      if (value) {

        if (param.config && param.config.op === 'like') {
          value = `like:${value}`;
        }

        param.value = value;
        this.params.push(param);
        query[key] = value;
      } else {
        delete query[key];
      }
    }

    this.router.navigate([], { queryParams: query });
    this.changed.emit(query);
    this.uxService.onSearch.emit(query);
    this.finishEditing();
  }

  searchByQuery(query: any) {
    this.params = [];
    if (query) {
      Object.keys(query).forEach((q) => {
        if (!this.options || !this.options.params.find((p) => p.key === query[q])) {
          this.params.push(new FieldEditorModel({ key: q, label: q, value: query[q] }));
        }
      });
    }

    this.changed.emit(query);
    this.uxService.onSearch.emit(query);
  }

  onResetFilters() {
    let url = this.router.url;
    this.setAdvanceSearch();
    if (url.startsWith('/reports')) {
      this.onSearchReports();
    } else {
      this.searchByParams();
    }
  }

  // onSelectReportSelector(event: MatSelectChange, param: FieldEditorModel) {
  //   param.value = event.value;
  //   if (param.value) {
  //     let option = param.config.options.filter((op: any) => op.value === param.value);
  //     param.valueLabel = option[0].label;
  //   }
  //   this.onSearchReports();
  // }

  // onReportsInputKeyUp(event: KeyboardEvent, param: FieldEditorModel) {
  //   param.value = event.target['value'];
  //   param.valueLabel = param.value;
  //   this.searchTextChanged.next('report');
  // }

  // onReportSelectDate(event: string | Date, param: FieldEditorModel) {
  //   param.value = event;
  //   param.valueLabel = moment(event).format('DD-MM-YYYY');
  //   this.onSearchReports()
  // }

  onSearchReports() {
    let hasValues = this.params.filter(param => param.value && param.value.label)
    this.uxService.onSearch.emit(hasValues);
  }

}
