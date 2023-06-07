import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Application } from '../../core/models';
import { SystemApi } from './system.api';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends SystemApi<Application> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('applications', http, roleService, uxService);
  }
}
