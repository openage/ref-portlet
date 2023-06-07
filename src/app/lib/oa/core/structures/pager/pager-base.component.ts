import { Location } from '@angular/common';
import { ErrorHandler, EventEmitter, Input, Output, Directive } from '@angular/core';
import { Subject } from 'rxjs';
import { PageOptions } from 'src/app/lib/oa/core/models/page-options.model';
import { Page } from 'src/app/lib/oa/core/models/page.model';
import { IApi } from 'src/app/lib/oa/core/services/api.interface';
import { ColumnModel } from 'src/app/lib/oa/core/models';
import { LocalStorageService } from '../../services';
import { Filters } from '../filter/index';
import { PagerOptions } from './pager-options.model';
import { IPage, IPager } from './pager.interface';

@Directive()
export class PagerBaseComponent<TModel> implements IPage<TModel>, IPager {

  @Output()
  fetched: EventEmitter<IPage<TModel>> = new EventEmitter();

  @Output()
  selected: EventEmitter<TModel> = new EventEmitter();

  @Output()
  created: EventEmitter<TModel> = new EventEmitter();

  oaAfterCreate: (item: TModel) => void;

  @Output()
  updated: EventEmitter<TModel> = new EventEmitter();

  oaAfterUpdate: (item: TModel) => void;

  @Output()
  removed: EventEmitter<TModel> = new EventEmitter();

  @Output()
  errored: EventEmitter<any> = new EventEmitter();

  @Input()
  items: TModel[];

  @Input()
  paging: any;

  @Input()
  view: string;

  @Input()
  empty: any;

  @Input()
  columns: any;

  fields: any;

  errors: string[] = [];
  filters: Filters;
  isProcessing = false;
  isGettingStats = false;

  currentPageNo = 1;
  totalPages = 0;
  pageNo = 1;
  pageSize: number;
  limit: number;
  offset: number;
  total: number;

  stats: any;
  sort: string;
  desc: boolean;

  pager: IPager;

  private _options: PagerOptions<TModel>;

  constructor(options: {
    api: IApi<TModel>,
    properties?: TModel,
    fields?: {
      id: 'id' | string,
      timeStamp: 'timeStamp' | string
    },
    watch?: number,
    cache?: IApi<TModel>,
    map?: (obj: any) => TModel,
    belongs?: (item: TModel) => boolean,
    pageOptions?: {
      limit?: number,
      offset?: number,
      sort?: any
    } | PageOptions,
    maxPagesToShow?: number,
    errorHandler?: ErrorHandler,
    filters?: any[],
    addOperator?: boolean,
    location?: Location,
    local?: LocalStorageService
  } | PagerOptions<TModel>) {
    this.items = [];

    if (options instanceof PagerOptions) {
      this._options = options;
    } else {
      this._options = new PagerOptions(options);
    }
    if (!this._options.pageOptions) {
      this._options.pageOptions = new PageOptions();
    }
    this.filters = new Filters({
      associatedList: this,
      filters: this._options.filters,
      location: this._options.location,
      addOperator: this._options.addOperator,
    });

    if (options.local) {
      this._options.pageOptions.limit = options.local.components('oa|paginator').get('limit') || options.pageOptions.limit;
    }

    this.pager = this;

    options.api.afterCreate.subscribe((i) => {
      if (!this._options.belongs || this._options.belongs(i))
        this.add(i);
      if (this.oaAfterCreate) {
        this.oaAfterCreate(i);
      }
    });
    options.api.afterUpdate.subscribe((i: any) => {
      const item = this.items.find((item: any) => item.id === i.id || item.code === i.code);

      if (item) {
        for (const key in i) {
          if ('isProcessing|isSelected|isEditing|isDeleted'.indexOf(key) === -1) {
            item[key] = i[key];
          }
        }
        if (this.oaAfterUpdate) {
          this.oaAfterUpdate(item);
        }
      }
    });
  }


  preInit() {

    if (!Array.isArray(this.columns)) {

    }
    const fields: any = {};

    const columns = [];

    if (typeof this.columns === 'string') {
      this.columns = this.columns.split(',')
    }

    this.columns.forEach(column => {
      if (typeof column === 'string') {
        column = {
          code: column
        }
      }

      column = new ColumnModel(column);

      columns.push(column);
      fields[column.code] = column;
    });

    this.fields = fields;
    this.columns = columns;
  }

  private convertToPageOption(pageNo: number) {
    const options = new PageOptions();
    if (this._options.pageOptions) {
      options.offset = (pageNo - 1) * this._options.pageOptions.limit;
      options.limit = this._options.pageOptions.limit;
      options.sort = this._options.pageOptions.sort;
    }
    return options;
  }

  fetch(params?: {
    pageNo?: number,
    offset?: number,
    limit?: number,
    sort?: any,
    path?: string,
    skipSubjectStore?: boolean,
    map?: (obj: any) => TModel
    handleError?: (error: any) => void
  }) {
    this.isProcessing = true;
    params = params || {};
    const paging = this.paging || {};

    const options: any = {};

    options.limit = this._options.pageOptions.limit;
    if (params.limit !== undefined) {
      options.limit = params.limit;
    } else if (paging.limit !== undefined) {
      options.limit = paging.limit;
    }
    if (options.limit) {
      const pageNo = params.pageNo || this.currentPageNo;
      options.offset = (pageNo !== 0 ? pageNo - 1 : 0) * options.limit;
    }

    options.sort = params.sort || paging.sort || this._options.pageOptions.sort;
    options.path = params.path || paging.path || this._options.pageOptions.path;
    options.map = params.map || this._options.map;
    options.skipSubjectStore = params.skipSubjectStore || this._options.pageOptions.skipSubjectStore;
    options.handleError = params.handleError ||
      (this._options.errorHandler ? (err) => { this._options.errorHandler.handleError(err) } : null);


    const subject = new Subject<Page<TModel>>();
    this._options.api.search(this.filters.getQuery(), options).subscribe((page) => {
      const items: TModel[] = [];
      page.stats = page.stats || {};
      page.items.forEach((item) => {
        items.push(item);
        if (this._options.cache && this._options.fields.id) {
          this._options.cache.update(item[this._options.fields.id], item).subscribe();
        }
      });

      this.stats = page.stats;
      this.items = items;
      this.total = page.total || page.stats.total || this.items.length;
      this.currentPageNo = page.pageNo;
      this.pageSize = page.pageSize;

      this.limit = options.limit;
      this.offset = options.offset;
      this.sort = options.sort;

      if (options.limit) {
        this.totalPages = Math.ceil(this.total / options.limit);
      } else {
        this.totalPages = 1;
      }

      this.isProcessing = false;
      this.fetched.emit(this);
      subject.next(page);
    }, (error) => {
      this.errors = [error];
      this.isProcessing = false;
      this.errored.next(error);
      if (options.handleError) {
        options.handleError(error);
      }
      subject.error(error);
    });
    return subject.asObservable();
  }

  select(item: TModel) {
    this.items.forEach((i: any) => i.isSelected = false);
    (item as any).isSelected = true;
    this.selected.emit(item);

    return this;
  }

  update(item: TModel) {
    const id = item[this._options.fields.id];
    (item as any).isProcessing = true;
    const subject = new Subject<TModel>();
    this._options.api.update(id, item).subscribe((data) => {
      if (this._options.cache) {
        this._options.cache.update(id, data).subscribe();
      }
      (item as any).isProcessing = false;
      this.updated.emit(data);
      subject.next(data);
      return data;
    }, (error) => {
      (item as any).isProcessing = false;
      this.errors = [error];
      this.errored.next(error);
      if (this._options.errorHandler) {
        this._options.errorHandler.handleError(error);
      }
      subject.error(error);
    });
    return subject.asObservable();
  }

  add(param: TModel) {
    this.items = [param, ...this.items];
    this.total = this.total + 1;
    this.created.emit(param);
    return this;
  }

  create(item: TModel) {
    (item as any).isProcessing = true;
    const subject = new Subject<TModel>();
    this._options.api.create(item).subscribe((data) => {
      if (this._options.cache && this._options.fields.id) {
        this._options.cache.update(data[this._options.fields.id], data).subscribe();
      }
      (item as any).isProcessing = false;
      // this.add(data);
      subject.next(data);
      return data;
    }, (error) => {
      (item as any).isProcessing = false;
      this.errors = [error];
      this.errored.next(error);
      if (this._options.errorHandler) {
        this._options.errorHandler.handleError(error);
      }
      subject.error(error);
    });
    return subject.asObservable();
  }

  pop(item: TModel): void {
    const id = item[this._options.fields.id];
    let found = false;
    if (this.items && this.items.length) {
      let i = this.items.length;
      while (i--) {
        if (this.items[i] && this.items[i][this._options.fields.id] === id) {
          this.items.splice(i, 1);
          found = true;
          break;
        }
      }
    }

    if (found) {
      this.total = this.total - 1;
      this.removed.emit(item);
    }
  }

  save(item) {
    if (item.id) {
      this.update(item);
    } else {
      this.create(item);
    }
  }

  remove(item: TModel) {
    const id = item[this._options.fields.id];
    (item as any).isProcessing = true;
    const subject = new Subject<TModel>();
    this._options.api.remove(id).subscribe(() => {
      if (this._options.cache) {
        this._options.cache.remove(id).subscribe();
      }
      (item as any).isProcessing = false;
      this.pop(item);
      subject.next(item);
      return;
    }, (error) => {
      (item as any).isProcessing = false;
      this.errors = [error];
      this.errored.next(error);
      if (this._options.errorHandler) {
        this._options.errorHandler.handleError(error);
      }
      subject.error(error);
    });

    return subject.asObservable();
  }

  clear() {
    this.total = 0;
    this.items = [];
    this.fetched.emit(this);
  }

  merge(items: TModel[]) {
    for (const item of items) {
      if (!this.items.find(i => i['id'] === item['id'] || i['code'] === item['code'])) {
        this.items.push(item);
      }
    }
  }

  pages(): number[] {
    const maxPages = this._options.maxPagesToShow;
    let index: number;

    const pageNos: number[] = [];

    let firstPage = 1;

    let lastPage = this.totalPages;

    if (this.totalPages > this._options.maxPagesToShow) {
      if (this.currentPageNo < this._options.maxPagesToShow) {
        lastPage = this._options.maxPagesToShow;
      } else if (this.currentPageNo > (this.totalPages - this._options.maxPagesToShow)) {
        firstPage = this.totalPages - this._options.maxPagesToShow;
      } else {
        firstPage = this.currentPageNo - this._options.maxPagesToShow / 2;
        if (firstPage < 1) { firstPage = 1; }
        lastPage = this.currentPageNo + this._options.maxPagesToShow / 2;
        if (lastPage > this.totalPages) { lastPage = this.totalPages; }
      }
    }

    if (firstPage !== 1) {
      pageNos.push(-2);
    }

    for (index = firstPage; index <= lastPage; index++) {
      pageNos.push(index);
    }

    if (pageNos.length === 0) {
      pageNos.push(1);
    }

    if (firstPage !== this.totalPages) {
      pageNos.push(-1);
    }

    return pageNos;
  }

  showPage(pageNo: number) {
    if (this.isProcessing) {
      return;
    }
    if (pageNo === -2) {
      pageNo = 1;
      return;
    }

    if (pageNo === -1) {
      pageNo = this.totalPages;
      return;
    }

    return this.fetch({ pageNo });
  }

  showItems(limit: number) {
    if (this.isProcessing) {
      return;
    }

    this._options.pageOptions.limit = limit;
    this._options.pageOptions.offset = 0;
    this._options.pageOptions['pageNo'] = 1;
    return this.fetch(this._options.pageOptions);
  }

  showPrevious() {
    if (this.isProcessing || this.currentPageNo <= 1) {
      return;
    }
    return this.showPage(this.currentPageNo - 1);
  }

  showNext() {
    if (this.isProcessing || this.totalPages <= this.currentPageNo) {
      return;
    }
    return this.showPage(this.currentPageNo + 1);
  }
}
