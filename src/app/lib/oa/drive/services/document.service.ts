import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UxService } from 'src/app/core/services';
import { Entity } from '../../core/models';
import { RoleService } from '../../core/services';
import { DriveApiBase } from './drive-api.base';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends DriveApiBase<any> {
  constructor(
    private httpClient: HttpClient,
    http: HttpClient,
    uxService: UxService,
    public roleService: RoleService) {
    super('docs', http, roleService, uxService);
  }

  getUrl() {
    return this.roleService.getService('drive').url;
  }

  public getDocUrl(template: string, entity: Entity, type: string, query?: {}, generateUrl?: boolean) {
    let url = this.getUrl();
    // url = `${url}/docs/${template}/${entity.id}.${type}?role-key=${this.roleService.currentRole().key}`;
    if (generateUrl) {
      url = `${url}/docs/${template}/generate/${entity.id}.${type}`
    } else {
      url = `${url}/docs/${template}/${entity.id}.${type}`
    }

    query = query || {};
    query['role-key'] = this.roleService.getRoleKey();

    const params = new URLSearchParams();
    for (const key in query) {
      if (query[key] !== undefined) {
        params.set(key, query[key]);
      }
    }

    const queryString = params.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }

    return url;
  }

  downloadById(code: string, id: string | number, type: 'pdf' | 'docx' | 'txt', query?: { [key: string]: string }): Observable<any> {
    const subject = new Subject<any>();
    let url = `${this.getUrl()}/docs/${code}/${id}.${type}`;

    query = query || {};
    query['role-key'] = this.roleService.getRoleKey();

    const params = new URLSearchParams();
    for (const key in query) {
      if (query[key] !== undefined) {
        params.set(key, query[key]);
      }
    }

    const queryString = params.toString();
    if (queryString) {
      url = `${url}?${queryString}`;
    }

    this.httpClient.get(url,
      {
        headers: this.headers(),
        responseType: 'blob' as 'json'
      })
      .subscribe(
        (response: any) => {
          const dataType = response.type;
          const binaryData = [];
          binaryData.push(response);
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
          window.open(downloadLink.href, '_blank');
          subject.next('Done');
        }
      );
    return subject.asObservable();
  }
  downloadByModel(code: string, model?: any) {
    return this.httpClient.post(`${this.getUrl()}/docs/${code}.pdf`, model,
      {
        headers: this.headers(),
        observe: 'response', responseType: 'blob'
      })
      .pipe(map((res) => {
        return new Blob([res.body], { type: res.headers.get('Content-Type') });
      }));
  }
  downloadDocByModel(code: string, model?: any) {
    return this.httpClient.post(`${this.getUrl()}/docs/${code}.docx`, model,
      {
        headers: this.headers(),
        responseType: 'blob' as 'blob'
      });
  }
  getHtmlFromDocx(file: File) {
    return this.upload(file, 'convert.html');
  }
  public headers() {
    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });
    headers = headers.append('x-role-key', this.roleService.currentRole().key);
    headers = headers.append('x-tenant-code', this.roleService.currentTenant().code);
    return headers;
  }


  getDocByUrl(url): Observable<any> {
    const subject = new Subject<any>();

    this.httpClient.post(url, { headers: this.headers() }).subscribe((response: any) => {
      if (response.isSuccess) {
        subject.next(response.date)
      } else {
        subject.error(response)
      }
    });
    return subject.asObservable();
  }

}
