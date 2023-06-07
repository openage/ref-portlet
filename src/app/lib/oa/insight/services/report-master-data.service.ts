import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { InsightApiBase } from './insight-api.base';

@Injectable({
  providedIn: 'root'
})
export class ReportMasterDataService extends InsightApiBase<any> {
  constructor(
    http: HttpClient, roleService: RoleService, uxService: UxService
  ) {
    super('reportData', http, roleService, uxService);
  }
}
