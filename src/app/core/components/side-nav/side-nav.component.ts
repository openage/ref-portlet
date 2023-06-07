import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Pic } from 'src/app/lib/oa/core/models/pic.model';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Organization, Role, Tenant } from 'src/app/lib/oa/directory/models';
import { Link } from 'src/app/lib/oa/core/structures';
import { ReportAreaService } from 'src/app/lib/oa/insight/services/report-area.service';
import { NavService } from '../../services/nav.service';
import { UxService } from '../../services/ux.service';

@Component({
  selector: 'app-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent implements OnInit, OnDestroy {

  @Input()
  view: 'side' | 'header' = 'side';

  navs: Link[];
  active: Link[];
  currentTenant: Tenant;
  currentOrganization: Organization;
  currentRole: Role;

  selectedNav: Link = new Link({});

  logo: Pic;

  isExpanded: boolean;

  @Output()
  isExpand: EventEmitter<boolean> = new EventEmitter()

  constructor(
    public auth: RoleService,
    public navService: NavService,
    public uxService: UxService,
    private reportAreaService: ReportAreaService,
    private router: Router
  ) {
    auth.tenantChanges.subscribe((t) => {
      this.currentTenant = t;
      this.render();
    });
    auth.organizationChanges.subscribe((t) => {
      this.currentOrganization = t;
      this.render();
    });
    auth.roleChanges.subscribe((r) => {
      this.currentRole = r;
      this.render();
    });

    navService.navsChanges.subscribe((n) => {
      this.navs = (n || []).filter((i) => this.auth.hasPermission(i.permissions) && i.view !== 'hidden');
      this.fetchReportAreas();
    });
    uxService.logoChanges.subscribe((n) => this.logo = n);
    navService.breadcrumbChanges.subscribe((links) => {
      this.active = links;
    });
  }

  ngOnInit() {
    this.render();
  }

  isActive(nav: Link) {
    return !!this.active && this.active.length && this.active.find((i) => i.code === nav.code);
  }

  ngOnDestroy(): void {
    this.selectedNav = new Link({});
  }

  select(nav: Link) {
    this.navs.forEach((i) => i.current = null);
    nav.current = new Link();
    this.navService.goto(nav);
  }

  fetchReportAreas() {
    if (!this.navs) {
      return;
    }
    const report = this.navs.find((n) => n.title === 'Reports');

    if (!report) {
      return;
    }

    if (!this.currentRole) {
      report.items = [];
      return;
    }

    if (report.items && report.items.length) {
      return;
    }
    this.reportAreaService.search().subscribe((page) => {
      report.items = page.items.map((i) => {
        return new Link({
          title: i.name,
          routerLink: ['/reports', i.code],
          permissions: i.permissions
        });
      });
    });
  }

  render() {
    this.currentRole = this.auth.currentRole();
    this.currentTenant = this.auth.currentTenant();
    this.currentOrganization = this.auth.currentOrganization();
    this.logo = this.uxService.getLogo();
    this.navs = this.navService.getNavs().filter((i) => this.auth.hasPermission(i.permissions) && i.view !== 'hidden');
    this.fetchReportAreas();
  }

  extend() {
    // this.isExpanded = !this.isExpanded;
    this.isExpand.emit(this.isExpanded)
  }
}
