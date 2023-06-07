import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Role, User } from 'src/app/lib/oa/directory/models';
import { Link } from 'src/app/lib/oa/core/structures';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { Organization } from 'src/app/lib/oa/directory/models/organization.model';
import { Tenant } from 'src/app/lib/oa/directory/models/tenant.model';
import { NavService } from '../../services';
import { UxService } from '../../services/ux.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  errors: string[] = [];
  // currentPage: Link;
  currentRole: Role;

  // currentUser: User;
  // currentTenant: Tenant;
  // currentOrganization: Organization;

  showSideNav = false;

  device: string;

  constructor(
    private router: Router,
    public navService: NavService,
    public uxService: UxService,
    public auth: RoleService,
    public snackBar: MatSnackBar
  ) {
    uxService.errors.subscribe((error) => {
      this.snackBar.open(error, null, { duration: 5000, verticalPosition: 'top', panelClass: 'error' });
      this.errors.push(error);
      // this.cleanErrors();
    });

    auth.roleChanges.subscribe((r) => this.currentRole = r);
    // auth.tenantChanges.subscribe((t) => this.currentTenant = t);
    // auth.organizationChanges.subscribe((t) => this.currentOrganization = t);
    // navService.currentPageChanges.subscribe(p => this.currentPage = p);
    uxService.deviceChanges.subscribe((d) => this.device = d);

    uxService.sideNavShowChanges.subscribe((show) => {
      if (this.device !== 'mobile') {
        this.showSideNav = show;
      }
    });
  }

  ngOnInit() {
    this.currentRole = this.auth.currentRole();
    // this.currentUser = this.auth.currentUser();
    // this.currentTenant = this.auth.currentTenant();
    // this.currentOrganization = this.auth.currentOrganization();
    this.device = this.uxService.getDevice();
    this.showSideNav = this.uxService.getShowSideNav();
  }

  // getUrl(role) {
  //   if (role.organization && role.organization.logo && role.organization.logo.url) {
  //     return role.organization.logo.url;
  //   } else if (role.tenant && role.tenant.logo && role.tenant.logo.url) {
  //     return role.tenant.logo.url;
  //   } else if (this.currentTenant && this.currentTenant.logo && this.currentTenant.logo.url) {
  //     return this.currentTenant.logo.url;
  //   } else {
  //     return null;
  //   }
  // }

}
