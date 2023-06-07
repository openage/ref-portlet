import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { PageOptions } from '../../core/models';
import { GenericApi } from './generic-api';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root',
})
export class WidgetDataService extends GenericApi<any> {
  constructor(
    http: HttpClient, auth: RoleService, uxService: UxService
  ) {
    super(http, 'insight', { collection: 'reportTypes', auth, errorHandler: uxService });
  }

  public data(code: string, query?: any, options?: PageOptions) {
    const pageOptions = options || new PageOptions({});
    pageOptions.path = `${code}/data`;
    return this.search(query, pageOptions);
  }

}
