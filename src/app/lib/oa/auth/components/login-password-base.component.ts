import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ErrorService } from 'src/app/core/services/error.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { IInputValidator } from 'src/app/lib/oa/core/services/input-validator.interface';
import { Role, User } from 'src/app/lib/oa/directory/models';
import { ErrorModel } from '../../core/models';

@Directive()
export class LoginPasswordBaseComponent implements OnInit, OnChanges {

  @Output()
  success: EventEmitter<Role> = new EventEmitter();

  @Output()
  failure: EventEmitter<Error> = new EventEmitter();

  @Input()
  user: User;

  idType = 'email';

  code: string;
  email: string;
  mobile: string;
  employeeNo: string;
  password = '';
  isProcessing = false;


  isValidated = false;
  inputError: ErrorModel;
  loginError: ErrorModel;


  // employeeNoError: string;
  // mobileError: string;
  // emailError: string;
  // codeError: string;

  constructor(
    private auth: RoleService,
    private errorHandler: ErrorHandler,
    private errorService: ErrorService,
    private validator: IInputValidator
  ) { }

  ngOnChanges(): void {
    if (this.user) {
      this.code = this.user.code;
      this.mobile = this.user.phone;
      this.email = this.user.email;
    }
  }

  ngOnInit() { }

  validateEmail = (value: string): Observable<any> => {
    const subject = new Subject<any>();
    this.isProcessing = true;
    this.auth.exists(value, 'email').subscribe((result) => {
      this.isProcessing = false;

      if (result.exists) {
        return subject.next(null);
      }

      if (!result.exists) {
        return subject.next('LOGIN_EMAIL_DNE');
      } else if (result.login && !result.login.password) {
        return subject.next('PASSWORD_NOT_SET');
      }
    });
    return subject.asObservable();
  }

  validateMobile = (value: string): Observable<any> => {
    const subject = new Subject<any>();
    this.isProcessing = true;
    this.auth.exists(value, 'mobile').subscribe((result) => {
      if (result.exists) {
        return subject.next(null);;
      }

      if (!result.exists) {
        return subject.next('LOGIN_MOBILE_DNE');
      }
    });
    return subject.asObservable();
  }

  validateEmployeeNo = (value: string): Observable<any> => {
    const subject = new Subject<any>();
    this.isProcessing = true;
    this.auth.exists(this.employeeNo, 'employee-code').subscribe((result) => {
      this.isProcessing = false;
      if (result.exists) {
        return subject.next(null);;
      }

      if (!result.exists) {
        return subject.next('LOGIN_EMPLOYEE_DNE');
      } else if (result.login && !result.login.password) {
        return subject.next('PASSWORD_NOT_SET');
      }
    });
    return subject.asObservable();
  }

  validateCode = (value: string): Observable<any> => {
    if (!this.validator.isMobileValid(this.code)) {
      return this.validateMobile(value);
    } else if (!this.validator.isEmailValid(this.code)) {
      return this.validateEmail(value);
    }
    const subject = new Subject<any>();
    this.isProcessing = true;
    this.auth.exists(this.code, 'code').subscribe((result) => {
      this.isProcessing = false;
      if (result.exists) {
        return subject.next(null);;
      }

      if (!result.exists) {
        return subject.next('CODE_DNE');
      } else if (result.login && !result.login.password) {
        return subject.next('PASSWORD_NOT_SET');
      }
    });
    return subject.asObservable();
  }

  confirm() {
    this.isProcessing = true;
    this.auth.verifyPassword(this.email, this.mobile, this.code, this.employeeNo, this.password).subscribe((role: Role) => {
      this.success.next(role);
      this.isProcessing = false;
    }, (err) => {

      this.loginError = this.errorService.get(err);

      this.failure.next(this.loginError);
      this.errorHandler.handleError(this.loginError);
      this.isProcessing = false;
    });
  }

  onValidate($event) {
    this.isValidated = true;
    this.inputError = $event;
  }
}
