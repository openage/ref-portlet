import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Tenant } from '../models';
import { SendItApiBase } from './sendit-api.base';

@Injectable()
export class TenantService extends SendItApiBase<Tenant> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('tenants', http, roleService, uxService);
  }
}
