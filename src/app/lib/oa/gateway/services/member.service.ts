import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Member } from '../models/member.model';
import { GatewayApi } from './gateway.api';

@Injectable()
export class MemberService extends GatewayApi<Member> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    uxService: UxService
  ) {
    super('members', http, auth, uxService);
  }
}
