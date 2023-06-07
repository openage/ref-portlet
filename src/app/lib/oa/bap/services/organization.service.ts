import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Organization } from '../models/organization.model';
import { BapApi } from './bap-api.base';

@Injectable()

export class OrganizationService extends BapApi<Organization> {
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('organizations', http, roleService, uxService);
  }
}
