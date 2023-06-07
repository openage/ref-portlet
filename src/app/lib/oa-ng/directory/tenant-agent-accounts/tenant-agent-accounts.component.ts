import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { UxService, ValidationService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { WizStepBaseComponent } from 'src/app/lib/oa/core/structures/wiz/wiz-step-base.component';
import { Organization, Role, RoleType } from 'src/app/lib/oa/directory/models';
import { DirectoryRoleService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-tenant-agent-accounts',
  templateUrl: './tenant-agent-accounts.component.html',
  styleUrls: ['./tenant-agent-accounts.component.css']
})
export class TenantAgentAccountsComponent extends WizStepBaseComponent implements OnInit, OnChanges {

  isProcessing = false;

  items: Role[] = [];

  @Input()
  role: Role;

  @Input()
  readonly = false;

  listColumns: string[] = ['organization', 'role', 'action'];

  selectedOrganization: Organization;
  selectedRoleType: RoleType;

  constructor(
    private api: DirectoryRoleService,
    private auth: RoleService,
    private uxService: UxService,
    private validationService: ValidationService
  ) {
    super();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.search();
  }

  search(): void {
    if (!this.role.email) { return; }
    this.isProcessing = true;
    this.api.search({ email: this.role.email }).subscribe((page) => {
      this.items = page.items.filter((role) => !!role.organization);
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
    });
  }

  validate(): boolean {
    return true;
  }

  complete(): boolean | Observable<any> {
    return true;
  }

  add(): void {
    if (!this.selectedOrganization) {
      return this.uxService.handleError('Please Select Customer');
    }

    if (this.items.find((item) =>
      item.organization.id === this.selectedOrganization.id ||
      item.organization.code === this.selectedOrganization.code)) {
      return this.uxService.handleError(`Account with Customer: ${this.selectedOrganization.name} already exist`);
    }

    const payload = {
      organization: this.selectedOrganization,
      type: this.role.type,
      employee: {
        email: this.role.email,
        profile: this.role.profile,
        phone: this.role.phone,
        status: 'active'
      },
      user: {
        email: this.role.email,
        profile: this.role.profile,
        phone: this.role.phone,
        status: 'active'
      }
    };

    this.isProcessing = true;
    this.api.create(payload).subscribe((role) => {
      this.selectedOrganization = null;
      this.search();
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
    });
  }

  onRemove(role): void {
    this.isProcessing = true;

    this.api.remove(role.id).subscribe(() => {
      this.isProcessing = false;
      this.search();
      this.uxService.showInfo('account successfully deleted');
    }, (err) => {
      this.isProcessing = false;
    });
  }

}
