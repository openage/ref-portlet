import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { RoleService, LocalStorageService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends PageBaseComponent {

  constructor(
    // public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: RoleService,
    private cache: LocalStorageService
  ) {
    super(navService, uxService, auth, route, cache);
  }

  setContext(items: any[]): void | any[] {
  }
}
