import { Injectable } from '@angular/core';
import { Journal } from '../models/journal.model';
import { HttpClient } from '@angular/common/http';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { BapApi } from './bap-api.base';

@Injectable({
  providedIn: 'root'
})
export class JournalService extends BapApi<Journal> {
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('journals', http, roleService, uxService);
  }
}
