import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Category } from '../models';
import { GatewayApi } from './gateway.api';

@Injectable()

export class CategoryService extends GatewayApi<Category> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    uxService: UxService
  ) {
    super('categories', http, auth, uxService);
  }
}
