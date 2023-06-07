import { Component, Input } from '@angular/core';

import { UxService } from 'src/app/core/services/ux.service';
import { SignUpBaseComponent } from 'src/app/lib/oa/auth/components/join-base-component';
import { RoleService } from 'src/app/lib/oa/core/services';
import { environment } from 'src/environments/environment';
import { ValidationService } from 'src/app/core/services';
import { OrganizationService } from 'src/app/lib/oa/directory/services/organization.service';

@Component({
  selector: 'auth-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent extends SignUpBaseComponent {

  idTypes: string[] = [];

  hide = true;

  showPassword: false;
  constructor(
    auth: RoleService,
    organizationService: OrganizationService,
    validationService: ValidationService,
    uxService: UxService
  ) {
    super(auth, organizationService, validationService, uxService);

    this.idTypes = environment.loginTypes;
  }


  labelFor(idType: string) {
    switch (idType) {
      case 'email':
        return 'Email';
      case 'mobile':
        return 'Mobile';
      case 'employeeNo':
        return 'Employee No';
    }
  }
}
