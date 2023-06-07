import { Location } from '@angular/common';
import { ErrorHandler } from '@angular/core';
import { IApi } from 'src/app/lib/oa/core/services/api.interface';
import { PageOptions } from '../../models/page-options.model';

export class PagerOptions<TModel> {

  api: IApi<TModel>;
  properties?: TModel;
  fields?: {
    id: 'id' | string,
    timeStamp: 'timeStamp' | string
  };
  watch?: number;
  cache?: IApi<TModel>;
  map?: (obj: any) => TModel;
  belongs?: (item: TModel) => boolean;
  pageOptions?: PageOptions;
  maxPagesToShow = 10;
  filters?: any[] = [];
  addOperator?: boolean;
  location?: Location;
  errorHandler?: ErrorHandler;
  local?: any

  constructor(obj?: {
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
      sort?: any,
    } | PageOptions,
    maxPagesToShow?: number,
    filters?: any[],
    addOperator?: boolean,
    errorHandler?: ErrorHandler,
    location?: Location,
    local?: any
  }) {
    if (!obj) { return; }
    if (obj.api) { this.api = obj.api; }
    if (obj.maxPagesToShow) { this.maxPagesToShow = obj.maxPagesToShow; }
    if (obj.location) { this.location = obj.location; }
    if (obj.fields) {
      this.fields = obj.fields;
    } else {
      this.fields = { id: 'id', timeStamp: 'timeStamp' };
    }
    if (obj.pageOptions) { this.pageOptions = new PageOptions(obj.pageOptions); }

    if (obj.properties) { this.properties = obj.properties; }

    if (obj.filters) {
      obj.filters.forEach((element) => {
        this.filters.push(element);
      });
    }

    if (obj.addOperator) {
      this.addOperator = obj.addOperator;
    }

    this.cache = obj.cache;
    this.watch = obj.watch;
    this.map = obj.map;
    this.belongs = obj.belongs;
    this.errorHandler = obj.errorHandler;
    if (obj.local) {
      this.local = obj.local;
    }
  }
}
