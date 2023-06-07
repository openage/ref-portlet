import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { DepartmentListComponent } from 'src/app/lib/oa-ng/directory/department-list/department-list.component';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { Department } from 'src/app/lib/oa/directory/models';
import { DepartmentNewComponent } from '../department-new/department-new.component';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent extends PageBaseComponent {

  @ViewChild('list')
  list: DepartmentListComponent;

  filters = ['code', 'name'];
  selectedStatus = 'active';
  selectedName: string;
  selectedCode: string;

  constructor(
    public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private router: Router,
    public auth: RoleService,
    private cache: LocalStorageService
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
    // this.selectedStatus = params.get('status-code');
    // this.selectedName = params.get('name');
    this.isInitialized = true;
  }

  onSearch($event: any) {

    if ($event['status-code']) {
      this.selectedStatus = $event['status-code']
    }

    if ($event['name']) {
      this.selectedName = $event['name']
    }
  }

  onSelect($event: Department) {
    this.router.navigate([$event.code], { relativeTo: this.route });
  }

  onRefresh() {
    this.list.fetch();
  }

  addDialog(): void {
    const dialogRef = this.dialog.open(DepartmentNewComponent, {
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
          break;
      }
    });
    return context;
  }
}
