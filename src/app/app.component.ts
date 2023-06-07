import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Entity, Theme } from 'src/app/lib/oa/core/models';
import { EnvironmentService } from 'src/app/lib/oa/core/services/environment.service';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { Action, Link } from 'src/app/lib/oa/core/structures';
import { Role } from 'src/app/lib/oa/directory/models';
import { environment } from 'src/environments/environment';
import { ConnectionDialogComponent } from './core/components/connection-dialog/connection-dialog.component';
import { InsightWidgetDialogComponent } from './core/components/insight-widget-dialog/insight-widget-dialog.component';
import { NavService, UxService } from './core/services';
import { ConnectionService } from './core/services/connection.service';
import { ErrorService } from './core/services/error.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = environment.title;
  styles: any = {};
  envName: string;

  back: Action;
  menu: any[];
  page: Link;
  currentRole: Role;

  currentEntity: Entity;

  sideNavMode = 'over';
  sideNavOpened = false;
  sideBarOpened = false;
  device = 'destop';
  theme: Theme;

  isBlocked = true;
  isInitialized = true;

  hasRole = false;
  hasHeader = true;

  @ViewChild('sidenav')
  sidenav: MatSidenav;

  dialogRef: MatDialogRef<ConnectionDialogComponent>;

  isSearchBarIncluded: boolean;

  authSubscription: Subscription;
  deviceSubscription: Subscription;
  blockSubscription: Subscription;
  sidenavSubscription: Subscription;
  entitySubscription: Subscription;
  warnings: string[] = [];
  pullDown: boolean;

  isNavExpanded: boolean;

  constructor(
    public dialog: MatDialog,
    private auth: RoleService,
    private environmentService: EnvironmentService,
    private titleService: Title,
    private router: Router,
    private navService: NavService,
    private uxService: UxService,
    private activatedRoute: ActivatedRoute,
    private connectionService: ConnectionService,
    private errorService: ErrorService
  ) {
    const application = this.auth.currentApplication();

    if (application && application.env && application.env !== 'prod') {
      this.envName = application.env;
    }

    this.authSubscription = this.auth.roleChanges.subscribe((role) => {
      this.currentRole = role;
      this.checkAppRoute();
    });

    this.deviceSubscription = this.uxService.deviceChanges.subscribe((device) => {
      this.device = device;

      if (device === 'desktop') {
        this.sideNavMode = 'side';
        this.sideNavOpened = true;
      } else {
        this.sideNavMode = 'over';
        this.sideNavOpened = false;
      }
    });

    this.theme = uxService.getTheme();
    if (this.theme) {
      this.styles = this.theme.styles || {};
    }
    uxService.themeChanges.subscribe((t) => {
      this.theme = t;
      if (this.theme) {
        this.styles = this.theme.styles || {};
      }
    });

    this.entitySubscription = this.uxService.entityChanges.subscribe((item) => {
      this.currentEntity = item;
    });

    this.sidenavSubscription = this.uxService.sideNavShowChanges.subscribe((show) => {
      if (show) {
        this.sidenav.open();
      } else {
        this.sidenav.close();
      }
    });

    this.blockSubscription = this.uxService.isBlockedChanges.subscribe((isBlocked) => {
      setTimeout(() => {
        this.isBlocked = isBlocked;
      });
    });

    this.connectionService.monitor().subscribe((isConnected: boolean) => {
      if (isConnected) {
        this.closeConnectionDialog();
      } else {
        this.openConnectionDialog();
      }
    });

    this.uxService.warnings.subscribe((warnings: string[]) => {
      this.warnings = warnings;
    });

    this.navService.navChanges.subscribe((data) => {
      this.page = data.page;

      if (this.page?.parent) {
        this.back = new Action({ code: 'back' });
        this.back.event = () => {
          this.navService.gotoParent(this.page);
        }
      } else {
        this.back = null;
      }

      if (this.page?.meta?.styles) {
        this.styles = this.page.meta.styles;
      }
      this.title = this.page?.title || environment.title;
      this.pullDown = this.page?.pullDown

      this.warnings = [];
      let code = data.get('message-code', this.activatedRoute);
      if (!code) { return }

      let error = this.errorService.get(code);
      if (!error) { return }

      let warning = this.warnings.find((warn) => warn === error.description);
      if (!warning) { this.warnings.push(error.description); }
    });

    this.navService.titleChanges.subscribe(title => {
      this.title = title || environment.title
    });

    this.uxService.contextMenuChanges.subscribe(items => {
      this.menu = items;
    });

  }

  onSearchBarVisible($event: boolean) {
    this.isSearchBarIncluded = $event;
  }

  openConnectionDialog() {
    this.dialogRef = this.dialog.open(ConnectionDialogComponent, { disableClose: true, width: '50%' });
  }

  closeConnectionDialog() {
    if (!!this.dialogRef) {
      this.dialogRef.close();
    }
  }

  checkAppRoute() {
    if (this.currentRole) {
      this.hasRole = true;
      if (this.currentRole?.type?.code === 'user') {
        this.hasRole = false;
      }
    } else {
      this.hasRole = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.innerWidth > 800) {
      this.uxService.setDevice('desktop');
    } else {
      this.uxService.setDevice('mobile');
    }
  }

  ngOnInit(): void {
    this.currentRole = this.auth.currentRole();
    this.checkAppRoute();
    this.device = this.uxService.getDevice();
    this.onResize();
  }

  ngAfterViewInit(): void {
    const currentUser = this.auth.currentUser();
    if (currentUser) {
      if (this.currentRole) {
        if (this.currentRole?.type?.code === 'user') {
          this.navService.goto('auth.signup');
        }
      } else {
        this.navService.goto('home.roles');
      }
    }
    this.uxService.block(false);
  }

  ngOnDestroy(): void {

  }

  onClose() {
    this.warnings = [];
  }

  onExpand($event) {
    this.isNavExpanded = $event
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
