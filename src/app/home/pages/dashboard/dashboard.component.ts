import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NavService } from 'src/app/core/services';
import { UxService } from 'src/app/core/services/ux.service';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { InsightWidgetDialogComponent } from 'src/app/core/components/insight-widget-dialog/insight-widget-dialog.component';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'home-pages-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends PageBaseComponent {
  isEditing = false;

  // code = 'home';

  monthStart = moment().startOf('month');

  //filters: ReportParam[];
  filters = []
  constructor(
    private router: Router,
    private navService: NavService,
    private uxService: UxService,
    public auth: RoleService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    cache: LocalStorageService
  ) {
    super(navService, uxService, auth, route, cache);

    // const code = this.route.snapshot.paramMap.get('code');
    // if (!code) { this.navService.goto('/home/dashboard/my'); }

    this.isProcessing = this.uxService.block(true);
    this.params.subscribe(params => {

      // let code = params.get('code') || 'root';
      // if (code === 'default') {
      //   code = 'root';
      // }
      // if (!this.auth.hasPermission(['tenant.admin', 'organization.admin', 'organization.supervisor'])) {
      //   code = 'my';
      // }

      // if (code !== this.code) {
      //   this.code = code;
      // }
    });

    this.navService.currentPageChanges.subscribe((link) => {
      this.page = undefined;
      this.page = link;
    });

  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.page = undefined;
    this.uxService.reset();
  }

  setContext(contextAction: any[]) {
    if (this.auth.hasPermission('tenant.admin')) {
      contextAction.push({ code: 'edit', event: () => { this.isEditing = !this.isEditing; } });
    }
    this.uxService.setContextMenu(contextAction);
  }

  onStatSelect($event) {
    if ($event.dialog) {

      switch ($event.dialog) {
        case 'widget':
          this.dialog.open(InsightWidgetDialogComponent, {
            data: $event,
            width: '70%'
          });
      }

    } else if ($event.routerLink) {
      if ($event.params['route']) {
        let routerLink = $event.routerLink + "/" + $event.params['route'];
        let url = this.router.createUrlTree([routerLink]).toString();
        window.open(`${window.location.origin}/${url}`, '_blank');
      }
      else {
        this.navService.goto($event.routerLink, $event.params);
      }
    }
  }

}
