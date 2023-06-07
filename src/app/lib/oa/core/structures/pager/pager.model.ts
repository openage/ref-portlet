import { Location } from '@angular/common';
import { ErrorHandler, Directive } from '@angular/core';
import { PageOptions } from 'src/app/lib/oa/core/models/page-options.model';
import { IApi } from 'src/app/lib/oa/core/services/api.interface';
import { PagerBaseComponent } from './pager-base.component';
import { PagerOptions } from './pager-options.model';

@Directive()
export class PagerModel<TModel> extends PagerBaseComponent<TModel>  {
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
      limit: number,
      offset?: number,
      sort?: any
    } | PageOptions,
    maxPagesToShow?: number,
    filters?: any[],
    addOperator?: boolean,
    location?: Location,
    errorHandler?: ErrorHandler
  } | PagerOptions<TModel>) {
    super(options);
  }
}
