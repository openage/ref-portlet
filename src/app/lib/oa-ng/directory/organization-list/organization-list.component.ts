import { Component, ErrorHandler } from '@angular/core';
import { OrganizationListBaseComponent } from 'src/app/lib/oa/directory/components/organization-list-base.component';
import { OrganizationService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css']
})

export class OrganizationListComponent extends OrganizationListBaseComponent {

  constructor(
    organizationService: OrganizationService,
    errorHandler: ErrorHandler
  ) {
    super(organizationService, errorHandler);
  }

}
