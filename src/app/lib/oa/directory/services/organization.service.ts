import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Organization } from '../models';
import { DirectoryApi } from './directory.api';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends DirectoryApi<Organization> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('organizations', http, roleService, uxService);
  }
}
