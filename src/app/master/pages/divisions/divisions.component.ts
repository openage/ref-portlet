import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { DivisionListComponent } from 'src/app/lib/oa-ng/directory/division-list/division-list.component';
import { Link } from 'src/app/lib/oa/core/structures';
import { NewDivisionComponent } from '../division-new/new-division.component';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { Division } from 'src/app/lib/oa/directory/models';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.css']
})
export class DivisionsComponent extends PageBaseComponent {

  @ViewChild('list')
  list: DivisionListComponent;

  showFilters = false;
  filters = ['code', 'name'];
  // , { key: 'code', group: 'other' }
  selectedStatus = 'active';
  selectedName: string;
  selectedCode: string;
  page: Link;
  isCurrent = true;

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

  onSelect($event: Division) {
    this.router.navigate([$event.code], { relativeTo: this.route });
  }

  onRefresh() {
    this.list.fetch();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(NewDivisionComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.list.fetch();
    });
  }

  setContext(context) {
    context.forEach((item) => {
      switch (item.code) {
        case 'add':
          item.event = () => {
            this.router.navigate(['new'], { relativeTo: this.route });
          }

          break;

        case 'refresh':
          item.refresh = () => this.onRefresh();
          break;
      }
    });
    return context;
  }
}
