import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Session } from '../models';
import { DirectoryApi } from './directory.api';

@Injectable()
export class SessionService extends DirectoryApi<Session> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('sessions', http, roleService, uxService);
  }
}
