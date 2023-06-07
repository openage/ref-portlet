import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  isCurrent = true;
  page: Link;

  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.navService.register('/settings/dashboard', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  setContext() {
    this.uxService.setContextMenu([]);
  }

}
