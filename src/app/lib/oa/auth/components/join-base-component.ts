import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { Pic } from '../../core/models';
import { IInputValidator, RoleService } from '../../core/services';
import { Employee, Organization, Profile, Role, User } from '../../directory/models';
import { OrganizationService } from '../../directory/services/organization.service';

@Directive()
export class SignUpBaseComponent implements OnInit, OnChanges {

  @Input()
  type: 'individual' | 'employee' = 'employee';

  @Input()
  typeCode: string;

  @Input()
  roleType: string;

  @Input()
  source: any;

  @Input()
  oneStep = true;

  @Output()
  created: EventEmitter<void> = new EventEmitter();

  @Output()
  processing: EventEmitter<boolean> = new EventEmitter();

  @Output()
  success: EventEmitter<Role> = new EventEmitter();

  @Output()
  failure: EventEmitter<Error> = new EventEmitter();

  @Input()
  sessionId: string;

  @Input()
  user: User;

  @Input()
  otp: string;

  @Input()
  tokenString: string;

  idType = 'email';

  email: string;
  mobile: string;
  employeeNo: string;
  code: string;
  organization: Organization;

  profile: Profile = new Profile({});
  employee: Employee;
  password: string;
  confirmPassword: string;
  orgCodeError: string;

  employeeNoError: string;
  mobileError: string;
  emailError: string;
  codeError: string;

  error: string;

  isProcessing = false;
  role: Role;

  orgExists: boolean;
  createNewOrg = false;
  domain = '';

  afterSignUp: boolean;

  constructor(
    public auth: RoleService,
    private organizations: OrganizationService,
    private validator: IInputValidator,
    private errorHandler: ErrorHandler
  ) {
  }

  ngOnInit() {

    const host = this.auth.currentApplication().host || window.location.host;
    const parts = host.split('.');
    this.domain = '';
    for (let index = 1; index < parts.length; index++) {
      this.domain = `${this.domain}.${parts[index]}`;
    }
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }
  // next() {
  //   this.isProcessing = true;
  //   this.auth.sendOtp(this.email, this.mobile, this.code).subscribe((user) => {
  //     this.isProcessing = false;
  //     this.userId = user.id;
  //   }, (error) => {
  //     this.error = error.message;
  //     this.isProcessing = false;
  //     this.errorHandler.handleError(error);
  //   });
  // }

  next() {
    this.isProcessing = true;
    if (!this.user) {
      this.user = new User({ email: this.email, profile: this.profile, password: this.password });
    }
    this.auth.signup(this.user, this.organization, this.roleType, this.source).subscribe((session) => {
      // this.Id = session.id;
      this.isProcessing = false;
      this.afterSignUp = true;
      this.created.emit();
    }, (error) => {
      this.isProcessing = false;
      this.error = error.message;
      if (this.error === 'USER_ALREADY_EXIST') {
        this.resendOtp();
      } else {
        this.errorHandler.handleError(error.message);
      }
    });
  }

  resendOtp() {
    this.isProcessing = true;
    this.auth.sendOtp(this.email, this.mobile, this.code).subscribe((user) => {
      this.isProcessing = false;
      this.sessionId = user.id;
    }, (error) => {
      this.error = error.message;
      this.isProcessing = false;
      this.errorHandler.handleError(error);
    });
  }

  private init() {
    this.profile = new Profile();
    this.employee = null;
    if (this.type !== 'individual') {
      this.organization = new Organization();
      if (this.type === 'employee') {
        this.employee = new Employee();
      }
    } else {
      this.organization = null;
    }
  }

  validateOrganization(code: string) {
    this.createNewOrg = undefined;
    this.orgExists = undefined;
    this.orgCodeError = this.validator.isOrganizationCodeValid(code);
    if (this.orgCodeError) {
      return;
    }
    this.organizations.get(`${code}/summary`).subscribe((organization) => {
      if (organization) {
        this.organization = organization;
        this.orgExists = true;
      } else {
        this.orgExists = false;
        this.organization = new Organization();
        this.organization.id = 'new';
        this.organization.code = code;
      }
    }, (err) => {
      this.organization = new Organization();
    });
  }

  validateEmailOnly() {
    this.emailError = this.validator.isEmailValid(this.email);
    if (this.emailError) {
      return;
    }
  }

  validateEmail() {
    this.emailError = this.validator.isEmailValid(this.email);
    if (this.emailError) {
      return;
    }
    this.auth.exists(this.email, 'email').subscribe((result) => {

      if (!result.exists) {
        this.emailError = '';
        return;
      }

      const error = new Error();

      error.name = 'EMAIL_TAKEN';
      error.message = `${this.email} is taken`;

      this.emailError = error.message;
      this.failure.next(error);
    });

  }

  validateMobile() {
    this.mobileError = this.validator.isMobileValid(this.mobile);
    if (this.mobileError) {
      return;
    }
    this.auth.exists(this.mobile, 'mobile').subscribe((data) => {
      if (data.exists) {
        this.mobileError = `${this.mobile} is taken`;

      } else {
        this.mobileError = '';

      }
    });
  }

  validateCode() {
    this.codeError = undefined;
    this.auth.exists(this.code, 'code').subscribe((exist) => {
      if (exist) {
        this.codeError = `${this.code} is taken`;
      } else {
        this.codeError = '';
      }
    });
  }

  validateEmployeeNo() {
    this.employeeNoError = undefined;
    // this.auth.exists(this.code, 'code').subscribe((exist) => {
    //   if (exist) {
    //     this.codeError = `${this.code} is taken`;
    //   } else {
    //     this.codeError = '';
    //   }
    // });
  }

  confirm() {
    this.isProcessing = true;
    this.auth.initPassword({
      id: this.sessionId,
      profile: this.profile
    }, this.otp, this.password).subscribe((role) => {
      if (this.oneStep && this.organization) {
        return this.join();
      }
      this.isProcessing = false;
      this.role = role;
      this.success.next(role);
    }, (error) => {
      this.isProcessing = false;
      this.error = error.message;
      this.errorHandler.handleError(error.message);
    });
  }

  verifyOtp() {
    this.isProcessing = true;
    this.auth.verifyOtp(this.sessionId, this.otp).subscribe((role) => {
      this.isProcessing = false;
      this.role = role;
      this.success.next(role);
    }, (error) => {
      this.isProcessing = false;
      this.error = error.message;
      this.errorHandler.handleError(this.error);
    });
  }

  activateSession() {
    this.isProcessing = true;
    this.auth.activateSession(this.sessionId, this.otp, this.tokenString).subscribe((session) => {
      this.isProcessing = false;
      this.success.next(null);
    }, (error) => {
      this.isProcessing = false;
      this.error = error.message;
      this.errorHandler.handleError(this.error);
    });
  }

  join() {
    this.isProcessing = true;
    this.processing.emit(true);

    if (this.organization && this.organization.id === 'new') {
      this.organization.id = null;
    }

    if (!this.profile && this.auth.currentUser()) { this.profile = this.auth.currentUser().profile; }

    this.auth.newRole(this.profile, this.type, this.organization, this.typeCode).subscribe((role) => {
      this.role = role;
      this.auth.setRole(role);
      this.isProcessing = false;
      this.processing.emit(false);
      this.success.emit(role);
    }, (error) => {
      this.isProcessing = false;
      this.processing.emit(false);
      this.error = error.message;
      this.errorHandler.handleError(error.message);
    });
  }

  cancel() {
    this.sessionId = null;
    this.role = null;
  }
}
