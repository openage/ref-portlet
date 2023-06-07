import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { PasswordResetBaseComponent } from 'src/app/lib/oa/auth/components/password-reset-base.component';
import { ErrorModel } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Organization } from 'src/app/lib/oa/directory/models';

@Component({
  selector: 'auth-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent extends PasswordResetBaseComponent {

  error: ErrorModel;
  token: string;
  currentOrganization: Organization;

  constructor(
    auth: RoleService,
    uxService: UxService,
    public validationService: ValidationService
  ) {
    super(auth, validationService, uxService);

    this.currentOrganization = auth.currentOrganization();
    auth.organizationChanges.subscribe((i) => this.currentOrganization = i);
  }

  isConfirmPasswordValid(falue) {
    if (this.query.password === this.query.confirmPassword) {
      return 'PASSWORD_DNM'
    }
  }
}
