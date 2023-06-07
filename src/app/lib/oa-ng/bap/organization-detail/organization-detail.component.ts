import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { OrganizationDetailsBaseComponent } from 'src/app/lib/oa/bap/components/organization-details-base.component';
import { OrganizationService } from 'src/app/lib/oa/bap/services';
import { RoleService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'bap-organization-detail',
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.css']
})
export class OrganizationDetailComponent extends OrganizationDetailsBaseComponent {

  @Input()
  view: 'bank' | 'customer' | 'supplier' = 'bank';
  @Input()
  invoice: any[];

  constructor(
    public auth: RoleService,
    api: OrganizationService,
    validator: ErrorHandler
  ) {
    super(api, validator, auth);
  }
  setDefault(item, i) {
    this.properties.bankDetails.forEach((data, index) => { if (i == index) { data.isDefault = true; } else { data.isDefault = false; }; })
    this.update(this.properties);
  }
}
