import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavService, UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { State } from 'src/app/lib/oa/gateway/models/state.model';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, OnDestroy {

  isCurrent = true;
  page: Link;
  searchText: string;
  selectedStatus = 'new';
  status: string;

  isSearching = false;

  constructor(
    public auth: RoleService,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.navService.register('/home/roles', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
    }).then((link) => this.page = link);

    this.route.queryParams.subscribe((params) => {
      if (params.status) {
        this.status = params.status;
      }
    });
  }

  ngOnInit() {
  }

  onStateSelect($event: State) {
    this.selectedStatus = $event.code;
  }

  onSelect($event) {
    this.navService.goto(`/system/${$event.type}s/${$event.id}`);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

}
