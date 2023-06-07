import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services/role.service';
import { Department } from '../models/department.model';
import { DirectoryApi } from './directory.api';

@Injectable()
export class DepartmentService extends DirectoryApi<Department> {
  departments: any;
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('departments', http, roleService, uxService);
  }
}
