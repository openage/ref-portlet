import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { IApi } from 'src/app/lib/oa/core/services';
import { RoleService } from '../../core/services';
import { ReportType } from '../models/report-type.model';
import { InsightApiBase } from './insight-api.base';

@Injectable()
export class ReportTypeService extends InsightApiBase<ReportType> {

  data: IApi<any>;

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('reportTypes', http, roleService, uxService);
    this.data = new InsightApiBase<ReportType>(`reportTypes/data`, http, roleService, uxService);
  }
}
