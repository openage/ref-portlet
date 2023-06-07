import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UxService, ValidationService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { WizStepBaseComponent } from 'src/app/lib/oa/core/structures/wiz/wiz-step-base.component';
import { Employee } from 'src/app/lib/oa/directory/models';
import { ResetPasswordEditorComponent } from '../reset-password-editor/reset-password-editor.component';

@Component({
  selector: 'directory-personal-editor',
  templateUrl: './personal-editor.component.html',
  styleUrls: ['./personal-editor.component.css']
})
export class PersonalEditorComponent extends WizStepBaseComponent implements OnInit {

  @Input()
  employee: Employee;
  emailError: string;
  email = '';
  isProcessing = false;

  @Input()
  readonly: boolean;

  @Input()
  usercode: string;

  isreadonly: boolean;

  @ViewChild('password')
  password: ResetPasswordEditorComponent;

  constructor(public validationService: ValidationService,
    public uxService: UxService,
    private auth: RoleService
  ) {
    super();

  }

  ngOnInit() {
  }
  validateEmail() {
    this.auth.exists(this.employee.email).subscribe((item) => {
      if (item.exists) {
        this.emailError = `${this.employee.email} is already Taken`;
        this.employee.email = null;
      } else {
        this.emailError = '';
      }
    });
  }
  validate(): boolean {
    if (!this.employee.profile.firstName) {
      return false;
    }

    if (!this.employee.config.aadhaar) {
      return false;
    }

    // if(!this.employee.profile.gender) {
    //   return false;
    // }

    if (!this.employee.email || !this.employee.phone) {
      return false;
    }

    if (this.validationService.isEmailValid(this.employee.email)) {
      this.uxService.handleError(this.validationService.isEmailValid(this.employee.email));
      return false;
    }

    if (this.validationService.isMobileValid(this.employee.phone)) {
      this.uxService.handleError(this.validationService.isMobileValid(this.employee.phone));
      return false;
    }

    return true;
  }
  complete(): Observable<any> | boolean {
    this.isComplete = true;
    return true;
  }

}
