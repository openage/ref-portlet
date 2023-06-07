import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { ProjectType } from '../models/project-type.model';
import { GatewayApi } from './gateway.api';

@Injectable()
export class ProjectTypeService extends GatewayApi<ProjectType> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    uxService: UxService
  ) {
    super('project-types', http, auth, uxService);
  }
}
