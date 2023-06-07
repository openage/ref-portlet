import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Workflow } from '../models/workflow.model';
import { GatewayApi } from './gateway.api';

@Injectable()
export class WorkflowsService extends GatewayApi<Workflow> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    uxService: UxService
  ) {
    super('workflows', http, auth, uxService);
  }
}
