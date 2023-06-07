import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ErrorService } from 'src/app/core/services/error.service';
import { LoginPasswordBaseComponent } from 'src/app/lib/oa/auth/components/login-password-base.component';
import { Organization } from 'src/app/lib/oa/directory/models';
import { environment } from 'src/environments/environment';
import { UxService } from 'src/app/core/services/ux.service';
import { ValidationService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';

@Component({
  selector: 'auth-password-login',
  templateUrl: './password-login.component.html',
  styleUrls: ['./password-login.component.css'],
})
export class PasswordLoginComponent extends LoginPasswordBaseComponent {

  @Output()
  forgotPassword: EventEmitter<void> = new EventEmitter();

  options: UntypedFormGroup;

  section: 'email' | 'password' = 'email';

  idTypes: string[] = [];

  showPassword = false;

  currentOrganization: Organization;

  constructor(
    auth: RoleService,
    uxService: UxService,
    validationService: ValidationService,
    errorService: ErrorService,
    fb: UntypedFormBuilder
  ) {
    super(auth, uxService, errorService, validationService);

    this.currentOrganization = auth.currentOrganization();
    auth.organizationChanges.subscribe((i) => this.currentOrganization = i);

    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });

    this.idTypes = environment.loginTypes;
  }

  showForgotPassword() {
    this.forgotPassword.emit();
  }

  labelFor(idType: string) {
    switch (idType) {
      case 'email':
        return 'Email';
      case 'mobile':
        return 'Mobile';
      case 'employeeNo':
        return 'Employee Number';
    }
  }
}
