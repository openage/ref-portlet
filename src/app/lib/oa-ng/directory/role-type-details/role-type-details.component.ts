import { Component } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleTypeDetailsBaseComponent } from 'src/app/lib/oa/directory/components/role-type-details-base.component';
import { PermissionGroupService, RoleTypeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-role-type-details',
  templateUrl: './role-type-details.component.html',
  styleUrls: ['./role-type-details.component.css']
})
export class RoleTypeDetailsComponent extends RoleTypeDetailsBaseComponent {

  constructor(
    api: RoleTypeService,
    uxService: UxService,
    permissionApi: PermissionGroupService
  ) {
    super(api, uxService, permissionApi);
  }

}
