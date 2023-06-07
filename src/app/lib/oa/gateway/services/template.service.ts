import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Template } from '../models/template.model';
import { GatewayApi } from './gateway.api';

@Injectable({
  providedIn: 'root'
})
export class TemplateService extends GatewayApi<Template> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    uxService: UxService
  ) {
    super('task-templates', http, auth, uxService);
  }
}
