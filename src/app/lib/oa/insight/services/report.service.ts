import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Report } from '../models';
import { InsightApiBase } from './insight-api.base';

@Injectable()
export class ReportService extends InsightApiBase<Report> {
  constructor(
    http: HttpClient, roleService: RoleService, uxService: UxService
  ) {
    super('reports', http, roleService, uxService);
  }
}
