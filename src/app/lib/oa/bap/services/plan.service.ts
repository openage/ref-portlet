import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Plan } from '../models/plan.model';
import { BapApi } from './bap-api.base';

@Injectable({
  providedIn: 'root'
})
export class PlanService extends BapApi<Plan> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('plans', http, roleService, uxService);
  }
}
