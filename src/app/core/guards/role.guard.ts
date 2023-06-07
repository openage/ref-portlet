import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Role } from 'src/app/lib/oa/directory/models';
import { NavService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: RoleService,
    private route: ActivatedRoute,
    private navService: NavService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // if (next.url && next.url[0] && next.url[0].path === 'errors') {
    //   return true;
    // }

    this.auth.setRedirectUrl(state.url);

    const roleKey = next.queryParams['role-key'];
    const token = next.queryParams['token'] || next.queryParams['access-token'];

    const currentRole = this.auth.currentRole();

    if ((!currentRole && roleKey) || (currentRole && roleKey && currentRole.key !== roleKey)) {
      return this.auth.setRoleKey(roleKey).pipe(map((role) => {
        // Removing Router Params
        // this.router.navigate([], { relativeTo: this.route, queryParams: { 'role-key': null } });
        return this.roleCheck(role, next);
      }));
    }

    if (!currentRole && token) {
      return this.auth.setSessionToken(token).pipe(map((role) => {
        // Removing Router Params
        // this.router.navigate([], { relativeTo: this.route, queryParams: { token: null } });
        return this.roleCheck(role, next);
      }));
    }

    return this.roleCheck(currentRole, next);
  }

  roleCheck(role: Role, next: ActivatedRouteSnapshot) {
    if (!role) {
      this.navService.goto('auth.login', {
        query: {
          redirect: window.location.href
        }
      });
      return false;
    }

    if (role.type.code === 'user') {
      this.navService.goto('auth.signup', {
        query: {
          redirect: window.location.href
        }
      });
      return false;
    }

    const params = (new URLSearchParams(window.location.search));

    let redirectUrl = params.get('redirectUrl') || params.get('redirect-url') || params.get('redirect');

    if (redirectUrl) {
      redirectUrl = this.auth.getRedirectUrl(redirectUrl);
      this.navService.goto(redirectUrl);
    }

    if (!next.data['permissions']) {
      return true;
    }

    const permissions = next.data['permissions'] as string[];

    const canAccess = this.auth.hasPermission(permissions);

    if (!canAccess) {
      console.error(`you don't have any of the permission: ${permissions}`);
    }

    return canAccess;
  }
}
