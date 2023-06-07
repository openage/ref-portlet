import { Component, OnInit } from '@angular/core';
import { UxService, ValidationService } from 'src/app/core/services';
import { ErrorModel } from 'src/app/lib/oa/core/models';
import { UserService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'auth-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  error: ErrorModel;

  query = {
    password: null,
    newPassword: null
  };

  confirmPassword: string = null;

  constructor(
    private uxService: UxService,
    private userService: UserService,
    public validationService: ValidationService
  ) { }

  ngOnInit(): void {
  }

  isConfirmPasswordValid(value) {
    if (this.query.newPassword !== value) {
      return 'PASSWORD_DNM'
    };
  }

  validate() {

    let errors = [];

    if (this.error) { errors.push(this.error) }

    if (!(this.query.password && this.query.newPassword)) {
      errors.push('Enter old and new passwords!')
    }

    if (this.confirmPassword !== this.query.newPassword) {
      errors.push('New Password and Confirm password must be same!')
    }

    return errors;
  }

  onSave() {
    const errors = this.validate();

    if (errors.length) {
      return this.uxService.showError(errors, { title: 'Check your submission!' })
    }

    this.uxService.showSuccess().subscribe((data: boolean) => {
      if (data) {
        this.userService.post(this.query, 'changePassword').subscribe(() => {
          this.uxService.showInfo('Password Updated successfully!');
          this.query = {
            password: null,
            newPassword: null
          }
          this.confirmPassword = null
        });
      }
    })
  }

}
