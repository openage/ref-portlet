import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Role } from 'src/app/lib/oa/directory/models';
import { NavService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private router: Router,
    private auth: RoleService,
    private navService: NavService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,

  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentRole = this.auth.currentRole();

    return this.roleCheck(currentRole, next);
  }

  roleCheck(role: Role, next: ActivatedRouteSnapshot) {
    if (!this.auth.currentUser() && !role) {
      return true;
    }

    const params = (new URLSearchParams(window.location.search));

    let redirectUrl = params.get('redirectUrl') || params.get('redirect-url') || params.get('redirect');

    if (redirectUrl) {
      redirectUrl = this.auth.getRedirectUrl(redirectUrl);
      this.navService.goto(redirectUrl);
    } else if (role && this.auth.currentUser()) {
      this.navService.goto('home.dashboard');
    }

    return false;
  }
}
