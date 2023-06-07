import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Contractor } from '../models';
import { DirectoryApi } from './directory.api';

@Injectable()
export class ContractorService extends DirectoryApi<Contractor> {
  contractors: any;
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('contractors', http, roleService, uxService);
  }
}
