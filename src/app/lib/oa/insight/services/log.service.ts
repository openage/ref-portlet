import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Log } from '../models/log.model';
import { InsightApiBase } from './insight-api.base';

@Injectable({
  providedIn: 'root'
})
export class LogService extends InsightApiBase<Log> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('logs', http, roleService, uxService);
  }
}
