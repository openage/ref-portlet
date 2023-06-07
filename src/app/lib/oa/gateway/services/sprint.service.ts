import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Sprint } from '../models';
import { GatewayApi } from './gateway.api';

@Injectable()
export class SprintService extends GatewayApi<Sprint> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    uxService: UxService
  ) {
    super('sprints', http, auth, uxService);
  }
}
