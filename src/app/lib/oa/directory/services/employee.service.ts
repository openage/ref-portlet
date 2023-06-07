import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Employee } from '../models';
import { DirectoryApi } from './directory.api';

@Injectable()
export class EmployeeService extends DirectoryApi<Employee> {

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
    super('employees', http, roleService, uxService);
  }

}
