import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Role, User } from 'src/app/lib/oa/directory/models';

@Directive()
export class LoginOtpBaseComponent implements OnInit, OnChanges {

  @Output()
  success: EventEmitter<Role> = new EventEmitter();

  @Input()
  user: User;

  email = '';
  mobile = '';
  code = '';
  otp = '';
  isProcessing = false;

  error: string;

  constructor(
    private auth: RoleService,
    private errorHandler: ErrorHandler
  ) { }

  ngOnChanges(): void {
    if (this.user) {
      this.code = this.user.code;
      this.mobile = this.user.phone;
      this.email = this.user.email;
    }
  }

  ngOnInit() { }

  next() {
    this.isProcessing = true;
    this.auth.sendOtp(this.email, this.mobile, this.code).subscribe((user) => {
      this.isProcessing = false;
      this.user = user;
    }, (error) => {
      this.error = error.message;
      this.isProcessing = false;
      this.errorHandler.handleError(error);
    });
  }

  cancel() {
    this.user = null;
  }

  confirm() {
    this.isProcessing = true;
    this.auth.verifyOtp(this.user.id, this.otp).subscribe((role: Role) => {
      this.isProcessing = false;
      this.success.next(role);
    }, (error) => {
      this.error = error.message;
      this.isProcessing = false;
      this.errorHandler.handleError(error.message);
    });
  }
}
