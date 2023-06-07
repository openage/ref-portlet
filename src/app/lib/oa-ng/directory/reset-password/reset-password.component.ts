import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { EmployeeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  @Input()
  code: string;

  newPassword: string;

  confirmPassword: string;

  constructor(
    private uxService: UxService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  checkPasswordSame() {
    if (!this.newPassword) {
      return this.uxService.showInfo('Password is required');
    }
    if (this.newPassword !== this.confirmPassword) {
      return this.uxService.showInfo('Password does not match');
    }
    this.employeeService.update(this.code, {
      password: this.newPassword,
      code: this.code
    });

    return this.uxService.showInfo('Password updated'),
      this.dialogRef.close();
  }

}
