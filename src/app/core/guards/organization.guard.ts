import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RoleService } from 'src/app/lib/oa/core/services';

@Injectable({
  providedIn: 'root'
})
export class OrganizationGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: RoleService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.currentOrganization()) {
      return true;
    }

    return false;
  }
}
