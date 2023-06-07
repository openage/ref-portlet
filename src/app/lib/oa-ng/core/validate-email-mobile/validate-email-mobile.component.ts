import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { ValidationService } from 'src/app/core/services/validation.service';
import { GenericApi, RoleService } from 'src/app/lib/oa/core/services';
import { ValidateOtpDialogComponent } from '../validate-otp-dialog/validate-otp-dialog.component';
import { ValidateOtpInlineComponent } from '../validate-otp-inline/validate-otp-inline.component';


@Component({
  selector: 'core-validate-email-mobile',
  templateUrl: './validate-email-mobile.component.html',
  styleUrls: ['./validate-email-mobile.component.css']
})
export class ValidateEmailMobileComponent implements OnInit {

  @ViewChild('otp')
  otp: ValidateOtpInlineComponent;

  @Input()
  view: 'dialog' | 'bottom' | 'onlyOtp-validate' = 'dialog'

  @Input()
  type: 'email' | 'mobile' = 'email'

  @Input()
  otpView: 'onlyOtp' | 'validate-with-button' = 'validate-with-button';

  @Input()
  value: string

  @Input()
  label: string = '';

  @Input()
  placeholder: string = '';

  @Input()
  maxLength: number = 50;

  @Input()
  session: any;

  @Input()
  activated: boolean = false;

  @Input()
  mandatory: boolean = false;

  @Input()
  addOnData: any = {};

  @Input()
  readonly: boolean = false;

  @Input()
  onlyOtp: boolean = false;

  @Output()
  valueOutput: EventEmitter<any> = new EventEmitter()

  @Output()
  sessionCreated: EventEmitter<any> = new EventEmitter()

  @Output()
  sessionError: EventEmitter<any> = new EventEmitter()

  @Output()
  sessionActivated: EventEmitter<any> = new EventEmitter()

  @Output()
  errorOutput: EventEmitter<string> = new EventEmitter()

  @Output()
  onDiscard: EventEmitter<boolean> = new EventEmitter()

  valueError: string;
  showOtpSection: boolean = false;

  constructor(
    private validator: ValidationService,
    private httpClient: HttpClient,
    private auth: RoleService,
    private uxService: UxService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.session && (this.session.state !== 'active') && (this.view === 'onlyOtp-validate')) {
      this.showOtpSection = true;
    }
  }

  validateTextOnly() {
    if (this.session && this.session.status === 'active') {
      if (this.session.way.value === this.value) {
        this.activated = true;
      } else {
        this.activated = false;
      }
    }

    this.valueOutput.emit(this.value)

    if (this.type === 'email') {
      this.valueError = this.validator.isEmailValid(this.value);
      this.errorOutput.emit(this.valueError)
      return
    } else if (this.type === 'mobile') {
      this.valueError = this.validator.isMobileValid(this.value);
      this.errorOutput.emit(this.valueError)
      return
    }
  }

  resendOtp() {
    this.valueOutput.emit(this.value)
    this.session.way.value = this.value
    this.otp.resendOtp()
  }

  createSession() {
    if (!this.value && this.valueError) {
      return this.uxService.handleError(`Please validate ${this.type === 'email' ? 'Email' : 'Mobile'}`)
    }

    let create = true

    // if (this.before) {
    //   create = this.before() as boolean;
    // }

    if (create) {
      const api = new GenericApi(this.httpClient, 'directory', {
        collection: 'sessions',
        auth: this.auth,
        errorHandler: this.uxService,
      });

      let model = {
        app: 'www',
        way: {
          type: this.type,
          value: this.value
        },
        status: 'new',
        meta: {
          data: this.addOnData
        }
      }

      if (this.type === 'email') {
        model['purpose'] = 'email-validation'
      } else if (this.type === 'mobile') {
        model['purpose'] = 'mobile-validation'
      }

      api.create(model).subscribe((s) => {
        if (this.view === 'dialog') {
          this.showOtpDialog(s)
        } else {
          this.sessionCreated.emit(s)
          this.session = s;
          this.showOtpSection = true;
        }
      })
    }
  }

  onSuccess($event) {
    if ($event && $event.status === 'active') {
      this.showOtpSection = false;
      this.readonly = true;
      this.activated = true;
    }
    this.sessionActivated.emit($event)
  }

  showOtpDialog(session): void {
    const dialogRef = this.dialog.open(ValidateOtpDialogComponent, {
      width: '400px'
    });

    dialogRef.componentInstance.session = session

    dialogRef.afterClosed().subscribe(s => {
      if (s && s.status === 'active') {
        this.session = s
        this.sessionCreated.emit(s)
        this.activated = true;
      }
    });
  }

}
