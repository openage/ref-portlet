import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { UxService } from 'src/app/core/services';
import { RoleService } from '../../core/services';
import { Organization } from '../models/organization.model';
import { User } from '../models/user.model';
import { GatewayApi } from './gateway.api';

@Injectable({
  providedIn: 'root'
})
export class GatewayOrganizationService extends GatewayApi<Organization> {
  constructor(
    http: HttpClient,
    private auth: RoleService,
    private uxService: UxService
  ) {
    super('organizations', http, auth, uxService);
  }

  public getMemberByRole(orgId, role): Observable<User> {
    const updateSubject = new Subject<User>();
    this.get(`${orgId}/member/${role}`).subscribe((item) => {
      updateSubject.next(item as any);
    }, (err) => {
      this.uxService.handleError(err);
      updateSubject.next(err);
    });

    return updateSubject;
  }

}
