import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { RoleListComponent } from 'src/app/lib/oa-ng/auth/role-list/role-list.component';
import { Entity } from 'src/app/lib/oa/core/models';
import { Link } from 'src/app/lib/oa/core/structures';
import { Role } from 'src/app/lib/oa/directory/models';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit, OnDestroy {

  @ViewChild('list')
  list: RoleListComponent;

  date = new Date();
  code = 'my';
  isSearching = false;

  selectedText: string;
  selectedCode: string;
  selectedEmail: string;
  selectedPhone: string;

  isCurrent = true;
  page: Link;
  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register('/home/team/my', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  onSelect(event: Role) {
    this.navService.goto(new Entity({ type: "agent", code: event.id }));
  }

  onRefresh() {
    // this.list.fetch();
  }

  setContext() {
    this.uxService.setContextMenu([{
      type: 'icon',
      icon: 'refresh',
      event: () => this.onRefresh()
    }, {
      helpCode: this.page.meta.helpCode
    }, 'close']);
  }

  setDate(event) {
    this.date = event;
  }

  onSearch(query) {
    query = query || {};
    this.selectedText = query.text;
    this.selectedCode = query.code;
    this.selectedEmail = query.email;
    this.selectedPhone = query.phone;
  }

  resetFilters() {
    this.selectedText = null;
    this.selectedCode = null;
    this.selectedEmail = null;
    this.selectedPhone = null;
  }

}
