import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services/role.service';
import { Target } from '../models/target.model';
import { InsightApiBase } from './insight-api.base';

@Injectable({
  providedIn: 'root'
})
export class TargetService extends InsightApiBase<Target> {
  constructor(
    http: HttpClient, roleService: RoleService, uxService: UxService
  ) {
    super('targets', http, roleService, uxService);
  }
}
