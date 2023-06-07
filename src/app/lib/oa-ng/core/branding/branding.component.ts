import { Component, Input, OnInit } from '@angular/core';
import { NavService, UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'core-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit {

  @Input()
  view: 'logo' | 'title' | 'organization' | 'tenant' = 'title';

  @Input()
  class: string;

  @Input()
  style: string;

  @Input()
  showOrgNameOnly: boolean;

  logoUrl: string = null;

  currentPage: Link;
  currentTenant: any;
  currentOrganization: any;

  constructor(
    public navService: NavService,
    public uxService: UxService,
    public auth: RoleService,
  ) {
    auth.tenantChanges.subscribe((t) => { this.currentTenant = t; this.setLogo() });
    auth.organizationChanges.subscribe((t) => { this.currentOrganization = t; this.setLogo(); });
    navService.currentPageChanges.subscribe(p => this.currentPage = p);
  }

  ngOnInit(): void {
    this.currentTenant = this.auth.currentTenant();
    this.currentOrganization = this.auth.currentOrganization();
    this.setLogo();
  }

  setLogo() {
    if (this.currentOrganization && this.currentOrganization.logo && this.currentOrganization.logo.url) {
      this.logoUrl = this.currentOrganization.logo.url;
    } else if (this.currentTenant && this.currentTenant.logo && this.currentTenant.logo.url) {
      this.logoUrl = this.currentTenant.logo.url;
    } else {
      return null;
    }
  }

}
