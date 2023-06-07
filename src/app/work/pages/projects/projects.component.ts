import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { NewProjectDialogComponent } from 'src/app/lib/oa-ng/gateway/new-project-dialog/new-project-dialog.component';
import { ProjectListComponent } from 'src/app/lib/oa-ng/gateway/project-list/project-list.component';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { Project } from 'src/app/lib/oa/gateway/models';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent extends PageBaseComponent {

  @ViewChild('list')
  list: ProjectListComponent;

  selectedStatus = 'active';
  selectedName: string;
  selectedCode: string;
  selectedView = 'rows';
  query: any;

  constructor(
    public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: RoleService,
    private cache: LocalStorageService,
  ) {
    super(navService, uxService, auth, route, cache);

    this.params.subscribe(params => {
      if (!this.isCurrent) {
        return;
      }

      this.init(params);
    });

    this.uxService.onSearch.subscribe((query) => {
      this.onSearch(query);
    })
  }

  init(params: any) {
    if (this.isInitialized) {
      return;
    }

    this.selectedView = params.get('view') || 'rows';
    this.selectedStatus = params.get('status-code');
    this.selectedName = params.get('name');
    this.afterInit()
    this.isInitialized = true;
  }

  onSearch($event: any) {

    if ($event['status-code']) {
      this.selectedStatus = $event['status-code']
    }

    if ($event['name']) {
      this.selectedName = $event['name']
    }
    this.query = $event;
  }

  onSelect($event: Project) {
    this.navService.goto({ type: 'project', code: $event.code });
  }

  onDataSelect($event) {
    let query = {}

    if ($event.member) {
      let user = $event.member?.user

      if (user) {
        if (user?.role?.id) {
          query['role-id'] = user.role.id
        } else {
          query['assignee'] = user.email

        }
      }
    }

    if ($event.type) {
      query['type'] = $event.type
    }

    $event.view = $event.view || 'standup'
    this.navService.goto(`/work/projects/${$event.project.code}/${$event.view}`, { query });
    // this.navService.goto(`/projects/${$event.project.code}/releases`, params);

  }

  onShowTask($event: Project) {
    this.navService.goto(`/projects/${$event.code}/tasks`);
  }

  onRefresh() {
    this.list.fetch();
  }

  addDialog(): void {
    const dialogRef = this.dialog.open(NewProjectDialogComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.onRefresh();
    });
  }

  setContext(context) {
    context.forEach((item) => {
      switch (item.code) {
        case 'add':
          item.event = () => this.addDialog();
          break;

        case 'refresh':
          item.refresh = () => this.onRefresh();
          break;

        case 'download':
          item.event = () => {
            this.uxService.showError('Not Implemented');
          };

        case 'list':
          item.event = (value) => {
            this.selectedView = 'list';
            value = value || {};
            value._refresh = true;
            this.onSearch(value);
          };
          break;

        case 'grid':
          item.event = (value) => {
            this.selectedView = 'grid';
            value = value || {};
            value._refresh = true;
            this.onSearch(value);
          };
          break;


      }
    });
    return context;
  }
}
