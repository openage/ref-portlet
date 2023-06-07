import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { RoleService } from '../../core/services/role.service';
import { LineItemType } from '../models/line-item-type.model';
import { BapApi } from './bap-api.base';

@Injectable({
  providedIn: 'root'
})
export class LineItemTypeService extends BapApi<LineItemType> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('lineItemTypes', http, roleService, uxService);
  }
}
