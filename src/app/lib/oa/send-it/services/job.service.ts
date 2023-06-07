import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Job } from '../models';
import { SendItApiBase } from './sendit-api.base';

@Injectable()
export class JobService extends SendItApiBase<Job> {
  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('jobs', http, roleService, uxService);
  }
  run(code: string) {
    return this.post({}, `${code}/run`);
  }
}
