import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { LoginOtpBaseComponent } from 'src/app/lib/oa/auth/components/login-otp-base.component';
import { RoleService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'auth-otp-login',
  templateUrl: './otp-login.component.html',
  styleUrls: ['./otp-login.component.css'],
})
export class OtpLoginComponent extends LoginOtpBaseComponent {

  constructor(
    auth: RoleService,
    uxService: UxService
  ) {
    super(auth, uxService);
  }

}
