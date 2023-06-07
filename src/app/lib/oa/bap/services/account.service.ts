import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { BapApi } from './bap-api.base';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends BapApi<Account> {
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('accounts', http, roleService, uxService);
  }
}
