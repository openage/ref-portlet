import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { GenericApi, RoleService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'core-validate-otp-inline',
  templateUrl: './validate-otp-inline.component.html',
  styleUrls: ['./validate-otp-inline.component.css']
})
export class ValidateOtpInlineComponent implements OnInit {

  @Input()
  view: 'onlyOtp' | 'validate-with-button' = 'validate-with-button';

  @Input()
  label: string;

  @Input()
  session: any;

  @Output()
  onSuccess: EventEmitter<any> = new EventEmitter();

  @Output()
  onError: EventEmitter<any> = new EventEmitter();

  @Output()
  onDiscard: EventEmitter<boolean> = new EventEmitter();

  otp: string;

  isProcessing: boolean;

  constructor(
    private httpClient: HttpClient,
    private auth: RoleService,
    private uxService: UxService
  ) { }

  ngOnInit(): void { }

  confirm() {
    this.isProcessing = true;

    const api = new GenericApi(this.httpClient, 'directory', {
      collection: 'sessions',
      auth: this.auth,
      errorHandler: this.uxService,
    });

    const id = this.session.id

    let model = this.session
    model['otp'] = this.otp
    model['status'] = 'active'

    delete model.token

    api.update(id, model).subscribe((s) => {
      this.isProcessing = false;
      this.onSuccess.emit(s)
    }, (error) => {
      this.uxService.handleError('Otp Invalid')
      this.isProcessing = false;
      this.onError.emit(true)
    });
  }

  resendOtp() {
    this.isProcessing = true;

    const api = new GenericApi(this.httpClient, 'directory', {
      collection: 'sessions',
      auth: this.auth,
      errorHandler: this.uxService,
    });

    const id = this.session.id

    let model = this.session

    api.post(model, `${id}/resend`).subscribe((s) => {
      this.isProcessing = false;
      this.uxService.showInfo('Otp sent')
    }, (error) => {
      this.uxService.handleError('Otp Invalid')
      this.isProcessing = false;
      this.onError.emit(true)
    });
  }

  cancel() {
    this.onDiscard.emit(true)
  }

}
