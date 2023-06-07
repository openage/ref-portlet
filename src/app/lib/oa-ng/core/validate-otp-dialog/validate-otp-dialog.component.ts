import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { GenericApi, RoleService } from 'src/app/lib/oa/core/services';

@Component({
  selector: 'core-validate-otp-dialog',
  templateUrl: './validate-otp-dialog.component.html',
  styleUrls: ['./validate-otp-dialog.component.css']
})
export class ValidateOtpDialogComponent implements OnInit {

  @Input()
  session: any;

  otp = '';

  isProcessing: boolean;

  constructor(
    private httpClient: HttpClient,
    private auth: RoleService,
    private uxService: UxService,
    public dialogRef: MatDialogRef<ValidateOtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void { }

  confirm() {
    if (!this.otp) {
      return this.uxService.handleError('Please fill the otp')
    }

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

    api.update(id, model).subscribe((s) => {
      this.isProcessing = false;
      this.dialogRef.close(s)
    }, (error) => {
      this.uxService.handleError('Otp Invalid')
      this.isProcessing = false;
      this.cancel()
    });
  }

  cancel() {
    this.dialogRef.close();
  }

}
