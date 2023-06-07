import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericApi } from 'src/app/lib/oa/core/services/generic-api';
import { Tenant } from '../../directory/models';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService extends GenericApi<Tenant> {

  constructor(
    http: HttpClient,
    role: RoleService
  ) {
    super(
      http,
      'directory', {
      collection: 'tenants',
      auth: role
    });
  }
}
