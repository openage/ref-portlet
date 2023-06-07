import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Designation } from '../models/designation.model';
import { DirectoryApi } from './directory.api';

@Injectable()
export class DesignationService extends DirectoryApi<Designation> {
  designations: any;
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('designations', http, roleService, uxService);
  }
}
