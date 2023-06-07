import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Channel } from '../models';
import { SendItApiBase } from './sendit-api.base';

@Injectable()
export class ChannelService extends SendItApiBase<Channel> {

  constructor(http: HttpClient, roleService: RoleService, uxService: UxService) {
    super('channels', http, roleService, uxService);
  }
}
