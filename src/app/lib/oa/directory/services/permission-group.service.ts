import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { PermissionGroup } from '../../core/structures';
import { DirectoryApi } from './directory.api';

@Injectable()
export class PermissionGroupService extends DirectoryApi<PermissionGroup> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('permissionGroups', http, roleService, uxService);
  }

}
