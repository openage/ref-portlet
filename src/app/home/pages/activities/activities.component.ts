import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavService } from 'src/app/core/services';
import { Entity } from 'src/app/lib/oa/core/models';
import { Link } from 'src/app/lib/oa/core/structures';
import { UxService } from 'src/app/core/services/ux.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  isCurrent = true;
  page: Link;
  isSearching = false;
  fromDate: any;
  toDate: any;
  entity: Entity = new Entity({});
  entityType: string;
  field: string;
  type: string;
  user: any = 'my';
  constructor(
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) {
    this.navService.register('/home/activities', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      this.user = this.page.meta.params.user || params.get('user') || 'my';

      if (this.page.meta.params.id || params.get('entity-id')) {
        this.entity.id = this.page.meta.params.id || params.get('entity-id')
      }
      if (this.page.meta.params.type || params.get('entity-type')) {
        this.entity.type = this.page.meta.params.type || params.get('entity-type')

        //set default tab
        this.setDefaultTab()
      }

      if (this.isCurrent) {
        this.setContext();
        this.setSearchParams();
      }
    }).then((link) => this.page = link);
    this.uxService.onSearch.subscribe((query) => {
      this.onSearch(query);
    })
  }

  ngOnInit() {
    // this.uxService.onSearch.subscribe((query) => {
    //   this.onSearch(query);
    // })
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  setSearchParams() {
    this.uxService.setSearchParams(this.page.meta.search);
  }

  setContext() {
    let contextAction: any[] = this.page?.meta?.context || [];
    this.uxService.setContextMenu(contextAction);
  }

  setDefaultTab() {
    const value = this.isCurrent ? this.entity.type : null
    let param = this.page.meta.search.params.find(p => p.control === 'tabs')
    if (param) { param.value = value }
  }

  entityClick(entity: any) {
    if (entity.type === 'rfq') {
      this.navService.goto(new Entity(entity));
    }
    if (entity.type === 'order') {
      this.navService.goto(new Entity(entity));
    } else {
      this.navService.goto(new Entity(entity.parent));
    }
  }

  onSearch(query: any) {
    this.fromDate = query.from;
    this.toDate = query.to;
    this.entityType = query.entityType;
    this.field = query.field;
    if (query.type == 'assignee') {
      this.type = 'updated';
      this.field = query.type;
    } else {
      this.type = query.type;
    }
    if (query.user) {
      this.user = query.user;
    }
    this.entity.type = query['entity-type']
    this.entity = new Entity(this.entity)
  }

}
