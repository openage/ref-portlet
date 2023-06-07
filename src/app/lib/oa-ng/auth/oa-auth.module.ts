import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { OaSharedModule } from 'src/app/lib/oa-ng/shared/oa-shared.module';
import { CurrentRoleComponent } from './current-role/current-role.component';
import { EmailSignUpComponent } from './email-sign-up/email-sign-up.component';
import { FacebookLoginButtonComponent } from './facebook-login-button/facebook-login-button.component';
import { GoogleLoginButtonComponent } from './google-login-button/google-login-button.component';
import { LinkedinLoginButtonComponent } from './linkedin-login-button/linkedin-login-button.component';
import { OtpLoginComponent } from './otp-login/otp-login.component';
import { PasswordLoginComponent } from './password-login/password-login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RoleListComponent } from './role-list/role-list.component';

import { SignUpComponent } from './sign-up/sign-up.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';
import { TwitterLoginButtonComponent } from './twitter-login-button/twitter-login-button.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const components = [
  PasswordLoginComponent,
  OtpLoginComponent,
  SignUpComponent,
  PasswordResetComponent,
  FacebookLoginButtonComponent,
  GoogleLoginButtonComponent,
  TwitterLoginButtonComponent,
  LinkedinLoginButtonComponent,
  CurrentRoleComponent,
  RoleListComponent,
  EmailSignUpComponent,
  SignupSuccessComponent,
  ChangePasswordComponent
];
const thirdPartyModules = [
  MatCardModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule
];
const services = [];
const guards = [];
const pipes = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    OaSharedModule,
    ...thirdPartyModules,
  ],
  declarations: [...components, ...pipes],
  exports: [...components, ...pipes],
  providers: [...services, ...guards]
})
export class OaAuthModule { }
