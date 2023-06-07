import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { IUser } from '../../core/models';
import { RoleService } from '../../core/services';
import { DriveApiBase } from './drive-api.base';

@Injectable()
export class UserService extends DriveApiBase<IUser> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('users', http, roleService, uxService);
  }

}
