import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { User } from '../models';
import { DirectoryApi } from './directory.api';

@Injectable()
export class UserService extends DirectoryApi<User> {

  states: { name: string, value: string }[] = [
    { name: 'In Complete', value: 'inComplete' },
    { name: 'Approval Pending', value: 'new' },
    { name: 'Active', value: 'active' },
    { name: 'In Active', value: 'in-active' },
    { name: 'Archived', value: 'archived' },
  ];

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('users', http, roleService, uxService);
  }
}
