import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Task } from '../models/task.model';
import { DirectoryApi } from './directory.api';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends DirectoryApi<Task> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService) {
    super('tasks', http, roleService, uxService);
  }
}
