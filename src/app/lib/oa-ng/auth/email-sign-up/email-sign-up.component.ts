import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UxService, ValidationService } from 'src/app/core/services';
import { SignUpBaseComponent } from 'src/app/lib/oa/auth/components/join-base-component';
import { RoleService } from 'src/app/lib/oa/core/services';
import { OrganizationService } from 'src/app/lib/oa/directory/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'auth-email-sign-up',
  templateUrl: './email-sign-up.component.html',
  styleUrls: ['./email-sign-up.component.css']
})

export class EmailSignUpComponent extends SignUpBaseComponent implements OnInit {

  afterSignUp: boolean;

  token: string;

  constructor(
    private router: Router,
    auth: RoleService,
    organizationService: OrganizationService,
    validationService: ValidationService,
    uxService: UxService
  ) {
    super(auth, organizationService, validationService, uxService);
  }

  ngOnInit() {
  }

  afterSignUpTab() {
    this.afterSignUp = true;
    this.next();
  }

  login() {
    const links = this.auth.currentTenant().meta.links;
    window.location.href = links.login;
  }
}
