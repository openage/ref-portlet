import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { BillingEntity } from '../models/billing-entity.model';
import { BapApi } from './bap-api.base';

@Injectable({
  providedIn: 'root'
})
export class BillingEntityService extends BapApi<BillingEntity> {
  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('billingEntities', http, roleService, uxService);
  }
}
