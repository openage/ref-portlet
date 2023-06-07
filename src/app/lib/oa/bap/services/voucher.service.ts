import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Voucher } from '../models/voucher.model';
import { BapApi } from './bap-api.base';

@Injectable({
  providedIn: 'root'
})
export class VoucherService extends BapApi<Voucher>{

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('vouchers', http, roleService, uxService);

  }
}
