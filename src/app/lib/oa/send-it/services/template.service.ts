import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Template } from '../models';
import { SendItApiBase } from './sendit-api.base';

@Injectable()
export class TemplateService extends SendItApiBase<Template> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('templates', http, roleService, uxService);
  }

  preview(code, data: any) {
  }
}
