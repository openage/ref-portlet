import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UxService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { RoleService } from '../../core/services';
import { Doc } from '../models';
import { SendItApiBase } from './sendit-api.base';

@Injectable()
export class DocumentService extends SendItApiBase<Doc> {

  constructor(
    http: HttpClient,
    private auth: RoleService,
    private httpClient: HttpClient,
    uxService: UxService) {
    super('docs', http, auth, uxService);
  }

  previewByCode(code: string, data: any): Observable<Doc> {
    return this.post(data, `${code}/preview`).pipe(map((item) => {
      return new Doc(item);
    }));
  }

  downloadPdf(code: string, id: string) {
    return this.httpClient.get(`${this.getRoot()}/docs/${code}/${id}.pdf`, {
      observe: 'response', responseType: 'blob'
    }).pipe(map((res) => {
      return new Blob([res.body], { type: res.headers.get('Content-Type') });
    }));
  }

  previewLink(code: string, id: string) {
    return `${this.getRoot()}/docs/${code}/${id}.pdf`;
  }

  downloadByModel(code: string, model?: any, headers?: any) {
    return this.httpClient.post(`${this.getRoot()}/docs/${code}.pdf`, model,
      {
        headers,
        observe: 'response', responseType: 'blob'
      })
      .pipe(map((res) => {
        return new Blob([res.body], { type: res.headers.get('Content-Type') });
      }));
  }

  private getRoot(): string {
    const service = this.auth.getService('send-it');
    if (service && service.url) {
      return service.url;
    }

    // return root;
  }

}
