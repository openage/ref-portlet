
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import * as moment from 'moment';
import { FileItem, FileUploader, Headers } from 'ng2-file-upload';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageOptions } from '../models/page-options.model';
import { Page } from '../models/page.model';
import { RemoteData } from '../models/remote-data.model';
import { ServerData } from '../models/server-data.model';
import { IApi } from './api.interface';
import { IAuth } from './auth.interface';

export class GenericApi<TModel> implements IApi<TModel> {

  private _createSubject = new Subject<TModel>();
  private _updateSubject = new Subject<TModel>();
  private _removeSubject = new Subject<string | number>();
  private _postSubject = new Subject<any>();
  private _bulkSubject = new Subject<any>();
  private _uploadSubject = new Subject<any>();

  private _auth: IAuth;
  private url: string;

  private subjectStore: any = {};
  private cache: any = {};
  private cachePeriod = 1000;

  afterCreate = this._createSubject.asObservable();
  afterUpdate = this._updateSubject.asObservable();
  afterRemove = this._removeSubject.asObservable();
  afterPost = this._postSubject.asObservable();
  afterBulk = this._bulkSubject.asObservable();
  afterUpload = this._uploadSubject.asObservable();

  constructor(
    private http: HttpClient,
    private code: string,
    private options?: {
      auth?: IAuth,
      collection?: any,
      headers?: { key: string, value?: any }[],
      map?: (obj: any) => TModel
      extension?: string,
      errorHandler?: ErrorHandler
    }
  ) {
    this.options = this.options || {};
    this._auth = this.options.auth;
  }

  public get(id: number | string, options?: {
    watch?: number
    offline?: boolean,
    timeStamp?: Date,
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<TModel> {
    options = options || {};
    const url = this.apiUrl(id);

    const subject = new Subject<TModel>();
    if (this.subjectStore[url]) {
      return this.subjectStore[url].asObservable();
    }

    this.subjectStore[url] = subject;

    let timeStamp: Date = options.timeStamp;
    const ticker = (options.watch ? timer(0, options.watch) : timer(0)).subscribe(() => {
      const requestTime = new Date();
      let request: any;
      if (this.cachePeriod && this.cache[url] &&
        this.cache[url].timeStamp && this.cache[url].timeStamp &&
        moment(this.cache[url].timeStamp).add(this.cachePeriod, 'milliseconds').isAfter(new Date(), 'millisecond')
      ) {
        setTimeout(() => {
          delete this.subjectStore[url];
          subject.next(this.cache[url].data);
        });
      } else {
        request = this.http
          .get<ServerData<TModel>>(url, { headers: this.getHeaders(timeStamp) })
          .subscribe(
            (dataModel) => {
              try {
                delete this.subjectStore[url];

                const isSuccess = dataModel.isSuccess !== undefined ? dataModel.isSuccess : (dataModel as any).IsSuccess;
                if (!isSuccess) {
                  const error = new Error(dataModel.error || dataModel.code || dataModel.message || 'failed');
                  return this.handleError(error, subject, options.handleError, request);
                }

                let model;

                if (options && options.map) {
                  model = options.map(dataModel.data);
                } else if (this.options.map) {
                  model = this.options.map(dataModel.data);
                } else {
                  model = dataModel.data;
                }

                if (!model && timeStamp) {
                  return;
                }

                if (model && (model as any)['timeStamp']) {
                  const modelTimeStamp = (model as any)['timeStamp'];

                  if (!timeStamp || !moment(timeStamp).isSame(modelTimeStamp, 'millisecond')) {
                    timeStamp = moment(modelTimeStamp).toDate();
                    return subject.next(model);
                  } else {
                    return;
                  }
                }

                timeStamp = requestTime;
                if (this.cachePeriod) {
                  this.cache[url] = {
                    data: model,
                    timeStamp: new Date()
                  };
                }
                subject.next(model);
              } catch (err) {
                this.handleError(err, subject, options.handleError);
              }
            },
            (err) => {
              delete this.subjectStore[url];
              if (err.status === 304) { // Not Modified
                // its ok - we need not let user know anything
                return;
              }
              this.handleError(err, subject, options.handleError);
            });
      }

      if (!subject.observers || !subject.observers.length) {
        ticker.unsubscribe();
        if (request) {
          request.unsubscribe();
        }
        return;
      }
    });
    return subject.asObservable();
  }
  public search(query?: any, options?: {
    offset?: number,
    limit?: number,
    offline?: boolean,
    sort?: any,
    path?: string,
    skipSubjectStore?: boolean,
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<Page<TModel>> {
    options = options || {};
    const headers = this.getHeaders();
    const pageOptions = new PageOptions(options);

    const mapper = options instanceof PageOptions ? null : options.map;
    const handleErrorFn = options instanceof PageOptions ? null : options.handleError;

    const subject = new Subject<Page<TModel>>();
    const url = this.getSearchUrl(query, pageOptions);

    if (this.subjectStore[url] && !options.skipSubjectStore) {
      return this.subjectStore[url].asObservable();
    }

    this.subjectStore[url] = subject;

    if (this.cachePeriod && this.cache[url] &&
      this.cache[url].timeStamp &&
      moment(this.cache[url].timeStamp).add(this.cachePeriod, 'milliseconds').isAfter(new Date(), 'millisecond')
    ) {
      setTimeout(() => {
        delete this.subjectStore[url];
        subject.next(this.cache[url].data);
      });
    } else {

      const request = this.http
        .get<Page<TModel>>(url, { headers })
        .subscribe(
          (response) => {
            delete this.subjectStore[url];
            const page = this.extractPage(response, { map: mapper, handleError: handleErrorFn }, subject, request);
            if (this.cachePeriod) {
              this.cache[url] = {
                data: page,
                timeStamp: new Date()
              };
            }
            return page;
          },
          (err) => {
            delete this.subjectStore[url];
            this.handleError(err, subject, handleErrorFn, request);
          });
    }
    return subject.asObservable();
  }
  public create(model: any, options?: {
    offline?: boolean,
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<TModel> {

    options = options || {};
    const subject = new Subject<TModel>();

    const request = this.http
      .post<ServerData<TModel>>(this.apiUrl(), JSON.stringify(model), { headers: this.getHeaders() })
      .subscribe(
        (response) => {
          const item = this.extractModel(response, options, subject, request);
          if (item) {
            this._createSubject.next(item);
          }
        },
        (err) => this.handleError(err, subject, options.handleError, request));
    return subject.asObservable();
  }
  public update(id: number | string, model: any, options?: {
    offline?: boolean,
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<TModel> {
    options = options || {};
    const subject = new Subject<TModel>();

    const request = this.http
      .put<ServerData<TModel>>(this.apiUrl(id), JSON.stringify(model), { headers: this.getHeaders() })
      .subscribe(
        (response) => {
          const item = this.extractModel(response, options, subject, request);
          if (item) {
            this._updateSubject.next(item);
          }
        },
        (err) => this.handleError(err, subject, options.handleError, request));
    return subject.asObservable();
  }
  public remove(id: number | string, options?: {
    offline?: boolean,
    handleError?: (error: any) => void
  }): Observable<void> {
    options = options || {};
    const subject = new Subject<void>();

    const request = this.http
      .delete<RemoteData>(this.apiUrl(id), { headers: this.getHeaders() })
      .subscribe(
        (dataModel) => {
          const isSuccess = dataModel.isSuccess !== undefined ? dataModel.isSuccess : (dataModel as any).IsSuccess;

          if (isSuccess) {
            this._removeSubject.next(id);
          }
          if (!subject.observers || !subject.observers.length) {
            request.unsubscribe();
            return;
          }
          if (isSuccess) {
            return subject.next();
          }

          const err = new Error(dataModel.error || dataModel.code || dataModel.message || 'failed');
          this.handleError(err, subject, options.handleError);
        },
        (err) => this.handleError(err, subject, options.handleError, request));
    return subject.asObservable();
  }

  public post(data: any, field: string, options?: {
    map?: (obj: any) => any,
    handleError?: (error: any) => void
  }): Observable<any> {

    options = options || {};

    const subject = new Subject<any>();

    const request = this.http
      .post<ServerData<any>>(this.apiUrl(field), JSON.stringify(data), { headers: this.getHeaders() })
      .subscribe(
        (dataModel) => {
          const shouldHandle = this.shouldHandle(subject, request);

          const isSuccess = dataModel.isSuccess !== undefined ? dataModel.isSuccess : (dataModel as any).IsSuccess;

          if (!isSuccess) {
            if (shouldHandle) {
              const error = new Error(dataModel.error || dataModel.code || dataModel.message || 'failed');
              this.handleError(error, subject, options.handleError);
            }
            return;
          }
          const item = options.map ? options.map(dataModel.data) : dataModel.data;

          this._postSubject.next(item);
          if (shouldHandle) {
            subject.next(item);
          }
        },
        (err) => this.handleError(err, subject, options.handleError, request));
    return subject.asObservable();
  }

  public bulk(models: TModel[], path?: string, options?: {
    map?: (obj: any) => TModel,
    handleError?: (error: any) => void
  }): Observable<any> {
    options = options || {};
    const subject = new Subject<any>();

    const request = this.http
      .post<Page<TModel>>(this.apiUrl(path || 'bulk'), JSON.stringify({ items: models }), { headers: this.getHeaders() })
      .subscribe(
        (response) => {
          if (!response.isSuccess) {
            this.handleError(response.message, subject, options.handleError, request);
          } else {
            subject.next(response.message);
          }
        },
        (err) => this.handleError(err, subject, options.handleError, request));
    return subject.asObservable();
  }

  public upload(file: File, path?: string, query?: any, options?: { handleError?: (error: any) => void }): Observable<any> {
    const params = new URLSearchParams();
    for (const key in query) {
      if (query[key]) {
        params.set(key, query[key]);
      }
    }
    const queryString = params.toString();
    const url = queryString ? `${this.apiUrl(path)}?${queryString}` : this.apiUrl(path);

    const headers: Headers[] = [];

    const httpHeaders = this.getHeaders();
    for (const name of httpHeaders.keys()) {
      const value = httpHeaders.get(name);

      if (name === 'Content-Type' || !value) {
        continue;
      }

      headers.push({
        name,
        value
      });
    }

    const uploader = new FileUploader({
      url,
      headers,
      autoUpload: true
    });

    uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    };

    const subject = new Subject<any>();

    uploader.onErrorItem = (item: FileItem, response: string, status: number) => {
      const error = new Error('failed');
      this.handleError(error, subject, options.handleError);
    };

    uploader.onCompleteItem = (item: FileItem, response: string, status: number) => {
      const dataModel = JSON.parse(response) as ServerData<any>;
      const isSuccess = dataModel.isSuccess !== undefined ? dataModel.isSuccess : (dataModel as any).IsSuccess;

      if (!isSuccess) {
        const error = new Error(dataModel.error || dataModel.code || dataModel.message || 'failed');
        this.handleError(error, subject, options ? options.handleError : undefined);
      } else {
        subject.next(dataModel.data);
        this._uploadSubject.next(dataModel.data);
      }
    };

    uploader.addToQueue([file]);

    return subject.asObservable();
  }

  private getHeaders(timeStamp?: Date): HttpHeaders {
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre- check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    if (timeStamp) {
      headers['If-Modified-Since'] = timeStamp.toISOString();
    }
    if (this.options.headers && this.options.headers.length > 0) {
      this.options.headers.forEach((item) => {
        let value: string | null;
        if (item.value) {
          switch (typeof item.value) {
            case 'string':
              value = item.value;
              break;
            case 'function':
              value = item.value();
              break;

            default:
              value = JSON.stringify(item.value);
              break;
          }
        } else {
          value = localStorage.getItem(item.key);
        }

        if (value) {
          headers[item.key] = value;
        }
      });
    }

    let orgCode = '';
    let tenantCode = '';

    if (this._auth) {
      const role = this._auth.currentRole();
      const application = this._auth.currentApplication();
      const organization = this._auth.currentOrganization();
      const tenant = this._auth.currentTenant();
      const session = this._auth.currentSession();

      if (application && application.code) {
        headers['x-application-code'] = application.code;
      }

      if (session && session.id) {
        headers['x-session-id'] = session.id;
      }

      if (session && session.token) {
        headers['x-access-token'] = session.token;
      }

      if (role && role.key) {
        headers['x-role-key'] = role.key;
      }

      if (organization && organization.code) {
        orgCode = organization.code;
      }

      if (tenant && tenant.code) {
        tenantCode = tenant.code;
      }
    }

    if (!orgCode && environment.organization && environment.organization.code) {
      orgCode = environment.organization.code;
    }

    if (!tenantCode && environment.code) {
      tenantCode = environment.code;
    }

    if (orgCode) {
      headers['x-organization-code'] = orgCode;
    }

    if (tenantCode) {
      headers['x-tenant-code'] = tenantCode;
    }

    return new HttpHeaders(headers);
  }

  private apiUrl(field?: number | string): string {

    if (!this.url) {

      if (this.code.toLowerCase().startsWith('http://') ||
        this.code.toLowerCase().startsWith('https://')
      ) {
        this.url = this.code;
      } else if (this._auth) {
        const service = this._auth.getService(this.code);
        if (service) {
          this.url = service.url;
        }
      }
    }

    if (!this.url) {
      throw new Error(`${this.code} is invalid`);
    }

    let url = this.url;

    if (this.options.collection) {

      let key: string;

      switch (typeof this.options.collection) {
        case 'string':
          key = this.options.collection;
          break;
        case 'function':
          key = this.options.collection();
          break;
        default:
          key = JSON.stringify(this.options.collection);
          break;
      }

      url = `${url}/${key}`;
    }

    if (field) {
      url = `${url}/${field}`;
    }

    if (this.options.extension) {
      url = `${url}.${this.options.extension}`;
    }

    return url;
  }

  private getSearchUrl(query: any, options?: PageOptions): string {

    const params = new URLSearchParams();
    // eslint-disable-next-line prefer-const
    for (let key in query) {
      if (query[key] !== undefined) {
        params.set(key, query[key]);
      }
    }

    let url = this.apiUrl();

    if (options) {
      if (options.offset || options.limit) {
        options.offset = options.offset || 0;
        options.limit = options.limit || 10;
        params.set('offset', options.offset.toString());
        params.set('limit', options.limit.toString());
      } else {
        params.set('noPaging', 'true');
      }

      if (options.sort) {
        Object.keys(options.sort).forEach(key => {
          params.set('sort', options.sort.toString());
          params.set('desc', (options.sort[key] === 'desc').toString());
        });
      }

      if (options.path) {
        url = `${url}/${options.path}`;
      }
    }

    const queryString = params.toString();
    if (queryString) {
      if (url.includes('?')) {
        const subStrings = url.split('?');
        url = `${subStrings[0]}?${queryString}&${subStrings[1]}`;
      } else {
        url = `${url}?${queryString}`;
      }
    }

    return url;
  }

  private extractModel(
    dataModel: ServerData<TModel>,
    options: { map?: (obj: any) => TModel, handleError?: (error: any) => void },
    subject: Subject<TModel>,
    request: Subscription): TModel {
    options = options || {};

    const shouldHandle = this.shouldHandle(subject, request);

    const isSuccess = dataModel.isSuccess !== undefined ? dataModel.isSuccess : (dataModel as any).IsSuccess;
    if (!isSuccess) {
      const error = new Error(dataModel.error || dataModel.code || dataModel.message || 'failed');

      if (shouldHandle) {
        this.handleError(error, subject, options.handleError, request);
      }
      return null;
    }

    let model: TModel;
    if (options && options.map) {
      model = options.map(dataModel.data);
    } else if (this.options.map) {
      model = this.options.map(dataModel.data);
    } else {
      model = dataModel.data as TModel;
    }

    if (shouldHandle) {
      subject.next(model);
    }
    return model;
  }

  private extractPage(
    dataModel: Page<TModel>,
    options: { map?: (obj: any) => TModel, handleError?: (error: any) => void },
    subject: Subject<Page<TModel>>,
    request?: Subscription): Page<TModel> {

    const shouldHandle = this.shouldHandle(subject, request);
    options = options || {};
    const isSuccess = dataModel.isSuccess !== undefined ? dataModel.isSuccess : (dataModel as any).IsSuccess;
    if (!isSuccess) {
      if (shouldHandle) {
        const error = new Error(dataModel.error || dataModel.code || dataModel.message || 'failed');
        this.handleError(error, subject, options.handleError);
      }

      return;
    }

    const data = (dataModel as any)['data'] || dataModel;
    const items: TModel[] = [];
    data.items.forEach((item: TModel) => {
      if (options.map) {
        items.push(options.map(item));
      } else if (this.options.map) {
        items.push(this.options.map(item));
      } else {
        items.push(item as TModel);
      }
    });

    const page: Page<TModel> = new Page<TModel>();
    page.pageNo = data.pageNo;
    page.pageSize = data.pageSize;
    page.total = data.total;
    page.stats = data.stats;
    page.items = items;

    if (shouldHandle) {
      subject.next(page);
    }
    return page;
  }

  private handleError(err: any, subject: Subject<any>, handleError?: (error: any) => void, request?: Subscription) {
    if (err && err.error && err.error.message === `Cannot read property 'permissions' of null`) {
      return this._auth.logout();
    }

    if (!this.shouldHandle(subject, request)) {
      return;
    }

    if (handleError) {
      handleError(err);
    } else if (this.options.errorHandler) {
      this.options.errorHandler.handleError(err);
    }
    subject.error(err);
  }

  private shouldHandle(subject: Subject<any>, request?: Subscription): boolean {
    if (!subject) {
      return false;
    }
    if (!subject.observers || !subject.observers.length) {
      if (request) {
        request.unsubscribe();
      }
      return false;
    }

    return true;

  }

}
