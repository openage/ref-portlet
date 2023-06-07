import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { EmployeeService } from 'src/app/lib/oa/directory/services';
import { UserService } from 'src/app/lib/oa/directory/services/user.service';

@Component({
  selector: 'directory-reset-password-editor',
  templateUrl: './reset-password-editor.component.html',
  styleUrls: ['./reset-password-editor.component.css']
})
export class ResetPasswordEditorComponent implements OnInit {

  @Input()
  employeeCode: string;

  @Input()
  change = false;

  password: string;

  newPassword: string;

  confirmPassword: string;

  constructor(
    private uxService: UxService,
    private employeeService: EmployeeService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.password = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  checkPasswordSame() {
    if (!this.password && this.change) {
      return this.uxService.showInfo('Password is required');
    }
    if (!this.newPassword) {
      return this.uxService.showInfo('New Password is required');
    }
    if (this.newPassword !== this.confirmPassword) {
      return this.uxService.showInfo('Password does not match');
    }
    if (this.change) {
      this.userService.post({
        password: this.password,
        newPassword: this.newPassword
      }, 'changePassword').subscribe(() => {
        return this.uxService.showInfo('Password updated'),
          this.newPassword = '',
          this.confirmPassword = '',
          this.password = '';
      });
    } else {
      this.employeeService.update(this.employeeCode, {
        password: this.newPassword
      }).subscribe(() => {
        return this.uxService.showInfo('Password updated'),
          this.newPassword = '',
          this.confirmPassword = '',
          this.password = '';
      });
    }
  }

  validate(): boolean {
    return true;
  }
  complete(): boolean | Observable<any> {
    return true;
  }

}
