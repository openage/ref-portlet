import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Role, User } from 'src/app/lib/oa/directory/models';
import { ErrorModel } from '../../core/models';
import { IInputValidator } from '../../core/services/input-validator.interface';

@Directive()
export class PasswordResetBaseComponent implements OnInit, OnChanges {

  @Output()
  success: EventEmitter<Role> = new EventEmitter();

  @Output()
  forgotComplete: EventEmitter<User> = new EventEmitter();

  @Output()
  canceled: EventEmitter<void> = new EventEmitter();

  @Output()
  failure: EventEmitter<Error> = new EventEmitter();

  @Input()
  user: User;



  email: string;
  mobile: string;
  code: string;
  otp: string;

  otpError = ErrorModel;

  query = {
    password: null,
    confirmPassword: null
  }

  error: ErrorModel;

  isProcessing = false;
  role: Role;

  orgExists: boolean;
  createNewOrg = false;

  isInvalidPassword: boolean;
  isInvalidOTP = false;

  constructor(
    private auth: RoleService,
    private validator: IInputValidator,
    private errorHandler: ErrorHandler,
  ) {
  }
  ngOnChanges(): void {
    if (this.user) {
      this.code = this.user.code;
      this.mobile = this.user.phone;
      this.email = this.user.email;
    }
  }

  ngOnInit() {
  }

  validateEmail = (value: string): Observable<any> => {
    const subject = new Subject<any>();
    this.isProcessing = true;
    this.auth.exists(value, 'email').subscribe((result) => {
      this.isProcessing = false;

      if (result.exists) {
        return subject.next(null);;
      } else {
        return subject.next('LOGIN_EMAIL_DNE');
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
      } else {
        return subject.next('LOGIN_MOBILE_DNE');
      }
    });
    return subject.asObservable();
  }

  validateCode = (value: string): Observable<any> => {
    const subject = new Subject<any>();
    this.isProcessing = true;
    this.auth.exists(this.code, 'code').subscribe((result) => {
      this.isProcessing = false;
      if (result.exists) {
        return subject.next(null);;
      } else {
        return subject.next('CODE_DNE');
      }
    });
    return subject.asObservable();
  }

  create() {
    this.isProcessing = true;
    this.auth.sendOtp(this.email, this.mobile, this.code, 'directory|session-forgot').subscribe((user) => {
      this.user = user;
      this.isProcessing = false;
    }, (error) => {
      this.isProcessing = false;
      this.error = error.message;
      this.errorHandler.handleError(error.message);
    });
  }

  confirm() {
    if (!this.query.password || !this.query.confirmPassword) {
      return this.errorHandler.handleError('Please fill all the mandatory fields!')
    }

    if (this.query.password !== this.query.confirmPassword) {
      return this.errorHandler.handleError('Password must be same!')
    }
    this.isProcessing = true;
    this.auth.forgotPassword(this.user.id, this.otp, this.query.password).subscribe((user) => {
      this.isProcessing = false;
      this.forgotComplete.next(user);
    }, (error) => {
      this.isInvalidOTP = true;
      this.isProcessing = false;
      this.error = error.message;
    });
  }

  cancel() {
    this.user = null;
    this.role = null;
    this.canceled.next();
  }
}
