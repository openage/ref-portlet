import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { DesignationListComponent } from 'src/app/lib/oa-ng/directory/designation-list/designation-list.component';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Designation } from 'src/app/lib/oa/directory/models';
import { DesignationNewComponent } from '../designation-new/designation-new.component';

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.css']
})
export class DesignationsComponent extends PageBaseComponent {

  @ViewChild('list')
  list: DesignationListComponent;

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

  onSelect($event: Designation) {
    this.router.navigate([$event.code], { relativeTo: this.route });
  }

  onRefresh() {
    this.list.fetch();
  }

  addDialog(): void {
    const dialogRef = this.dialog.open(DesignationNewComponent, {
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
      }
    });
    return context;
  }

}
