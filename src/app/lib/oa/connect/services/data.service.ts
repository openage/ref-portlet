import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { ConnectApi } from './connect-api.base';

@Injectable({
  providedIn: 'root'
})
export class DataService extends ConnectApi<any> {
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('data', http, roleService, uxService);
  }
}

