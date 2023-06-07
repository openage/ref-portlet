import { Observable } from 'rxjs';
import { PageOptions } from '../../models/page-options.model';

export interface IPager {
  currentPageNo: number;
  totalPages: number;
  total: number;
  showPage(pageNo: number): Observable<any>;
  showItems(limit: number): Observable<any>;
  fetch(options?: PageOptions): any;
}

export interface IPage<TModel> {
  currentPageNo: number;
  totalPages: number;
  total: number;
  items: TModel[];
  stats: any;
  sort: string;
  desc: boolean;
}
