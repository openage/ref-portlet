import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { ConnectApi } from './connect-api.base';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends ConnectApi<Task> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('tasks', http, roleService, uxService);
  }
}
