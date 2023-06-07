import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Role, RoleType } from '../models';
import { DirectoryApi } from './directory.api';

@Injectable()
export class DirectoryRoleService extends DirectoryApi<Role> {

  states: { name: string, value: string }[] = [
    { name: 'In Complete', value: 'inComplete' },
    { name: 'Approval Pending', value: 'new' },
    { name: 'Active', value: 'active' },
    { name: 'In Active', value: 'in-active' },
    { name: 'Archived', value: 'archived' },
  ];

  systemRoles: RoleType[] = [];

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('roles', http, roleService, uxService);

    this.systemRoles = [
      new RoleType({
        name: 'Designer',
        code: 'designer'
      }),
      new RoleType({
        name: 'Developer',
        code: 'developer'
      }),
      new RoleType({
        name: 'Product Manager',
        code: 'product-manager'
      }),
      new RoleType({
        name: 'Project Manager',
        code: 'project-manager'
      }),
      new RoleType({
        name: 'Admin',
        code: 'tenant.admin'
      }),
      new RoleType({
        name: 'Test Lead',
        code: 'test-lead'
      }),
      new RoleType({
        name: 'Tester',
        code: 'tester'
      }),
      new RoleType({
        name: 'Customer Normal',
        code: 'customer.normal'
      }),
      new RoleType({
        name: 'User',
        code: 'user'
      })
    ];
  }
}
