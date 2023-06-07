import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { RoleType } from '../models';
import { DirectoryApi } from './directory.api';

@Injectable()
export class RoleTypeService extends DirectoryApi<RoleType> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('roleTypes', http, roleService, uxService);
  }

}
