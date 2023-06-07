import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Subscription } from '../models/subscription.model';
import { BapApi } from './bap-api.base';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends BapApi<Subscription> {

  constructor(
    http: HttpClient,
    roleService: RoleService,
    uxService: UxService
  ) {
    super('subscriptions', http, roleService, uxService);

  }
}
