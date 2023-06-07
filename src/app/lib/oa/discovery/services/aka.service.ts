import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Aka } from '../models/aka.model';
import { DiscoveryApi } from './discovery-api.base';

@Injectable({
  providedIn: 'root'
})
export class AkaService extends DiscoveryApi<Aka>{

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('akas', http, roleService, uxService);
  }
}
