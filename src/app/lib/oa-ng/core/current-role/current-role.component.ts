import { Component, OnInit } from '@angular/core';
import { NavService, UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Role, Tenant } from 'src/app/lib/oa/directory/models';

@Component({
  selector: 'oa-current-role',
  templateUrl: './current-role.component.html',
  styleUrls: ['./current-role.component.scss']
})
export class CurrentRoleComponent implements OnInit {
  isImpersonateSession: Boolean = false
  currentRole: Role;
  currentTenant: Tenant;


  constructor(
    public navService: NavService,
    public auth: RoleService,
    public uxService: UxService
  ) {
    auth.roleChanges.subscribe((r) => this.currentRole = r);
    this.auth.impersonateChanges.subscribe(result => {
      this.isImpersonateSession = result
    })
  }

  ngOnInit(): void {
    this.currentRole = this.auth.currentRole();
    this.currentTenant = this.auth.currentTenant();
  }

  selectRole(role) {
    this.auth.setRole(role);
    this.navService.goto('/home/dashboard');
    setTimeout(() => {
      location.reload();
    }, 2);
  }

  endSession() {
    if (this.isImpersonateSession) {
      this.endImpersonation();
    } else {
      this.logout();
    }
  }

  endImpersonation() {
    this.auth.endImpersonateSession()
    this.navService.goto('/home/dashboard');
  }

  logout = () => {
    this.auth.logout();
    this.uxService.reset();
  }

  // getLogo(): string {
  //   if (!this.currentRole.organization) {
  //     return '/assets/images/logo.png'
  //   }
  //   if (this.currentRole.organization.logo && this.currentRole.organization.logo.url) {
  //     return this.currentRole.organization.logo.url;
  //   } else {
  //     return `/assets/images/${this.currentRole.organization.type}/default.png`;
  //   }
  // }

}
