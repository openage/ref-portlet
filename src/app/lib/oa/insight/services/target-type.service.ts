import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services/role.service';
import { TargetType } from '../models/target-type.model';
import { InsightApiBase } from './insight-api.base';

@Injectable({
  providedIn: 'root'
})
export class TargetTypeService extends InsightApiBase<TargetType> {
  constructor(
    http: HttpClient, roleService: RoleService, uxService: UxService
  ) {
    super('targetTypes', http, roleService, uxService);
  }
}
