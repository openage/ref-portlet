import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Template } from '../models/template.model';
import { DriveApiBase } from './drive-api.base';

@Injectable({
  providedIn: 'root'
})

export class TemplateService extends DriveApiBase<Template> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('fileTemplates', http, roleService, uxService);
  }
}
