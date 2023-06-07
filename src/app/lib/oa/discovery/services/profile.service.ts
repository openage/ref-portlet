import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Profile } from '../models/profile.model';
import { DiscoveryApi } from './discovery-api.base';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends DiscoveryApi<Profile>{

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('profiles', http, roleService, uxService);

  }
}
