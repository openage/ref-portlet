import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Division } from '../models/division.model';
import { DirectoryApi } from './directory.api';

@Injectable()
export class DivisionService extends DirectoryApi<Division> {
  divisions: any;
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('divisions', http, roleService, uxService);
  }
}
