import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Journal } from '../models';
import { InsightApiBase } from './insight-api.base';

@Injectable()
export class JournalService extends InsightApiBase<Journal> {
  constructor(
    http: HttpClient, roleService: RoleService, uxService: UxService
  ) {
    super('journals', http, roleService, uxService);
  }
}
