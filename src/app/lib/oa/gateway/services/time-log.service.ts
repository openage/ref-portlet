import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { TimeLog } from '../models';
import { GatewayApi } from './gateway.api';

@Injectable()
export class TimeLogService extends GatewayApi<TimeLog> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    uxService: UxService
  ) {
    super('time-logs', http, auth, uxService);
  }
}
