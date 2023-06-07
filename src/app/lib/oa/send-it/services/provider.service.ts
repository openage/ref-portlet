import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Provider } from '../models';
import { SendItApiBase } from './sendit-api.base';

@Injectable()
export class ProviderService extends SendItApiBase<Provider> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('providers', http, roleService, uxService);
  }
}
