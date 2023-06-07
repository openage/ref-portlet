import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { ReportArea } from '../models';
import { InsightApiBase } from './insight-api.base';

@Injectable({
  providedIn: 'root',
})
export class ReportAreaService extends InsightApiBase<ReportArea> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('reportAreas', http, roleService, uxService);
  }
}
