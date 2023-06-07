import { Observable } from 'rxjs';
import { PageOptions } from '../models/page-options.model';
import { Page } from '../models/page.model';
import { IUploader } from './uploader.interface';

export interface IApi<TModel> extends IUploader {

  afterCreate: Observable<TModel>;

  afterUpdate: Observable<TModel>;

  afterRemove: Observable<number | string>;

  afterPost: Observable<any>;

  afterBulk: Observable<any>;

  afterUpload: Observable<any>;
  get(id: number | string, options?: {
    watch?: number
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<TModel>;

  search(query?: any, options?: {
    offset?: number,
    limit?: number,
    sort?: any,
    skipSubjectStore?: boolean,
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<Page<TModel>>;
  create(model: any, options?: {
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<TModel>;
  update(id: number | string, model: any, options?: {
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<TModel>;
  remove(id: number | string, options?: {
    offline?: boolean,
    handleError?: (error: any) => void
  }): Observable<void>;
  post(model: any, key?: string, options?: {
    map?: (obj: any) => any,
    handleError?: (error: any) => void
  }): Observable<any>;
  bulk(models: any[], path?: string, options?: {
    map?: (obj: any) => any,
    handleError?: (error: any) => void
  }): Observable<any>;
  // upload(file: File, path?: string, query?: any): Observable<any>;
}
