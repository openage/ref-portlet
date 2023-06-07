import { Component, ErrorHandler, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { Theme } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Role } from 'src/app/lib/oa/directory/models';
declare const gapi: any;
@Component({
  selector: 'auth-google-login-button',
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss'],
})
export class GoogleLoginButtonComponent implements OnInit {

  @Output()
  success: EventEmitter<Role> = new EventEmitter();

  @Output()
  failure: EventEmitter<Error> = new EventEmitter();

  @Input()
  isProcessing = false;

  public auth2: any;
  code: string;
  error: string;

  theme: Theme;

  constructor(
    private auth: RoleService,
    private errorHandler: ErrorHandler,
    private uxService: UxService,
    private zone: NgZone
  ) {
    this.theme = uxService.getTheme();
    uxService.themeChanges.subscribe((t) => this.theme = t);
  }

  ngOnInit() {
    gapi.load('auth2', () => {

      const config = this.auth.currentTenant().meta.google || {};
      config.cookiepolicy = config.cookiepolicy || 'single_host_origin';
      config.scope = config.scope || [
        'email',
        // 'profile',
        // 'https://www.googleapis.com/auth/plus.me',
        // 'https://www.googleapis.com/auth/contacts.readonly',
        // 'https://www.googleapis.com/auth/admin.directory.user.readonly'
      ].join(' ');

      this.auth2 = gapi.auth2.init(config);
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        this.zone.run(() => {
          this.isProcessing = true;
          // let profile = googleUser.getBasicProfile();
          const token = googleUser.getAuthResponse().id_token;
          this.isProcessing = this.uxService.block(true);
          this.auth.authSuccess(token, 'google').subscribe((role: Role) => {
            this.isProcessing = false;
            this.success.next(role);
            this.isProcessing = this.uxService.block(false);
          }, (err) => {
            this.isProcessing = false;
            const error = new Error();
            error.name = err.message;
            error.message = err.message;
            if (error.name === 'PASSWORD_INVALID') { error.message = 'wrong password'; }
            this.error = error.message;
            this.failure.next(error);
            this.errorHandler.handleError(error.message || error);
            this.isProcessing = this.uxService.block(false);
          });
        });
      }, (error: any) => {
        // console.error(JSON.stringify(error, undefined, 2));
      });
  }
}
