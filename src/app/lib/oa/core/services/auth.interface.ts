import { Observable } from 'rxjs';
import { Organization, Role, Service, Session, Tenant, User } from '../../directory/models';
import { Application } from '../models';

export interface IAuth {
  currentRole(): Role;
  currentUser(): User;
  currentApplication(): Application;
  currentTenant(): Tenant;
  currentOrganization(): Organization;
  currentSession(): Session;
  getService(code: string): Service;

  getHeaders(): { key: string, value: string }[];

  hasPermission(permissions: string | string[]): boolean;
  logout(): Observable<string>;
}
