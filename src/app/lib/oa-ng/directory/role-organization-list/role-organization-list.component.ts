import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Organization } from 'src/app/lib/oa/directory/models';

@Component({
  selector: 'directory-role-organization-list',
  templateUrl: './role-organization-list.component.html',
  styleUrls: ['./role-organization-list.component.css']
})
export class RoleOrganizationListComponent implements OnInit {

  organizations: Organization[] = [];

  isProcessing = false;

  @Input()
  view: 'list' | 'table' = 'table';

  @Input()
  columnType: string;

  @Output()
  selected: EventEmitter<Organization> = new EventEmitter<Organization>();

  columns: string[] = ['orgName', 'email', 'phone', 'action'];

  constructor(
    private auth: RoleService
  ) { }

  ngOnInit() {
    const currentUser = this.auth.currentUser();
    if (currentUser) {
      const orgRoles = currentUser.roles.filter((role) => !!role.organization);
      this.organizations = orgRoles.map((role) => new Organization(role.organization));
    }
  }

  select(item) {
    this.selected.emit(item);
  }

}
