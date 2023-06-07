import { Component, ErrorHandler, Input, Pipe } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleService, WidgetDataService } from 'src/app/lib/oa/core/services';
import { OrganizationDetailsBaseComponent } from 'src/app/lib/oa/directory/components/organization-details-base.component';
import { OrganizationService } from 'src/app/lib/oa/directory/services';
import { Organization } from 'src/app/lib/oa/directory/models/organization.model';
@Component({
  selector: 'directory-organization-summary',
  templateUrl: './organization-summary.component.html',
  styleUrls: ['./organization-summary.component.css']
})
export class OrganizationSummaryComponent extends OrganizationDetailsBaseComponent {
  @Pipe({ name: 'value' })
  @Input()
  title = 'Organization';

  @Input()
  view: string;

  @Input()
  type: string;

  @Input()
  style: any = 'heading';

  items: Organization[] = [];
  constructor(
    public dialog: MatDialog,
    public orgService: OrganizationService,
    public auth: RoleService,
    validator: ErrorHandler,
    public widgetDataService: WidgetDataService
  ) {
    super(orgService, validator, auth);
    this.isProcessing = false;
    this.set(new Organization());
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.code) {
      return
    }
    this.getBillingOrg(this.code);
    this.getSalesOrg(this.code);
  }

  onNameChange() {
    this.orgService.search({
      name: this.properties.name,
      type: this.type
    }).subscribe((p) => {
      this.items = p.items;
    });
  }

  onSelect(item: Organization) {
    this.set(item);
    this.fetched.emit(item);
  }

  getBillingOrg(item) {
    this.isProcessing = true;

  }
  getSalesOrg(item) {
    this.isProcessing = true;
  }

}
