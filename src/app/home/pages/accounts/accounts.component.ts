import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { CustomerListComponent } from 'src/app/dff/components/customer-list/customer-list.component';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { Link } from 'src/app/lib/oa/core/structures';
import { SessionService } from 'src/app/lib/oa/directory/services/session.service';
import { State } from 'src/app/lib/oa/gateway/models';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  @ViewChild('list')
  list: CustomerListComponent;

  isCurrent = true;
  page: Link;
  searchText: string;
  selectedStatus: string;
  selectedUser: string;
  from: string;
  to: string;
  type = 'customer';
  sector: string;
  highRegion: string;
  mediumRegion: string;
  lowRegion: string;
  category: string;
  email: string;
  phone: string;
  salesAgent: any;
  pricingAgent: any;
  operator: any;
  businessHead: any;
  clientSource: string;
  revenuePotential: string;
  members: any[] = [];

  isSearching = false;

  constructor(
    public auth: RoleService,
    public sessionService: SessionService,
    private navService: NavService,
    public uxService: UxService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.page = this.navService.register('/home/accounts', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
        this.setSearchParams();
      }
    });
  }

  ngOnInit() {
    this.uxService.onSearch.subscribe((query) => {
      this.onSearch(query);
    })
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  setContext() {
    let contextAction: any[] = [];
    contextAction = [{
      type: 'icon',
      icon: 'refresh',
      event: () => this.list.fetch(),
    }, 'close'];

    if (this.page && this.page.meta && this.page.meta.helpFolderCode) {
      contextAction.push({
        type: 'icon',
        icon: 'help_outline',
        event: () => this.navService.goto(`/support/help/${this.page.meta.helpFolderCode}`)
      });
    }
    this.uxService.setContextMenu(contextAction);
  }

  setSearchParams() {
    this.uxService.setSearchParams(this.page.meta.search);
  }

  onSearch(query) {
    query = query || {};
    this.searchText = query.name || query.text;
    this.selectedUser = query.user;
    this.from = query.from;
    this.to = query.to;
    this.sector = query.sector;
    this.highRegion = query.highRegion;
    this.mediumRegion = query.mediumRegion;
    this.lowRegion = query.lowRegion;
    this.category = query.category;
    this.email = query.email;
    this.phone = query.phone;
    this.selectedStatus = query.status;
    this.clientSource = query.clientSource;
    this.revenuePotential = query.revenuePotential;
    this.salesAgent = query.salesAgent;
    this.pricingAgent = query.pricingAgent;
    this.operator = query.operator;
    this.businessHead = query.businessHead;
    // if (query.salesAgent) {
    //   this.members.push(query.salesAgent)
    // }
    // if (query.pricingAgent) {
    //   this.members.push(query.pricingAgent)
    // }
    // if (query.operator) {
    //   this.members.push(query.operator)
    // }
  }

  reset() {
    this.category = null;
    this.clientSource = null;
    this.selectedStatus = null;
    this.revenuePotential = null;
  }

  onStatSelect($event) {
    this.reset();
    this.onSearch($event.queryParams);
    const queryParams = {
      fetch: false,
      category: this.category,
      clientSource: this.clientSource,
      revenuePotential: this.revenuePotential
    };
    this.navService.changeQueryParams(queryParams, this.route);
  }

  onStateSelect(item: State) {
    this.selectedStatus = item ? item.code : null;
  }

  onNew() {
    this.navService.goto(`/home/accounts/new`);
    this.uxService.resetSearchParams();
  }

  onSelect($event) {
    this.navService.goto(`/home/accounts/${$event.code}`);
    this.uxService.resetSearchParams();
  }
}
