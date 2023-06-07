import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorModel } from 'src/app/lib/oa/core/models';
import { Action } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  @Input()
  message = 'Are you sure?';

  @Input()
  errors: Error | ErrorModel | Error[] | ErrorModel[] | string | string[];

  @Input()
  title = 'Confirm';

  @Input()
  confirmTitle = 'Yes';

  @Input()
  confirmColor = 'primary';

  @Input()
  cancelTitle = 'No';

  @Input()
  msgClass: string = 'center';

  @Input()
  options: {
    actions?: Action[],
    hide?: {
      confirm?: boolean,
      cancel?: boolean
    },
    timer?: number
  };

  displayErrors: any[];

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.options = this.options || {};
    this.options.hide = this.options.hide || {};
    this.options.actions = this.options.actions || [];

    if (this.options.timer) {
      this.scheduleConfirm(this.options.timer);
    }

    if (this.errors) {
      this.displayErrors = [];
      if (typeof this.errors === 'string') {
        this.displayErrors.push(this.errors as any);
      } else if (Array.isArray(this.errors)) {
        this.displayErrors.push(... this.errors as any);
      } else {
        this.displayErrors.push(this.errors.message as any);
      }
    }
    if (!this.displayErrors || !this.displayErrors.length) {
      return
    }

    for (let error of this.displayErrors as any) {
      if (!error.actions || !error.actions.length) {
        continue;
      }
      error.actions.forEach(a => {
        let action = this.options.actions.find(optionAction => optionAction.code === a.code)
        if (!action) { this.options.actions.push(a) }
      })
    }

  }

  scheduleConfirm(timer: number): void {
    setTimeout(() => { this.dialogRef.close(true); }, timer);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onStatSelect($event) {
    // TODO
  }

  @HostListener('keydown.esc')
  public onEsc() {
    this.dialogRef.close();
  }

  @HostListener('keydown.enter')
  public onEnter() {
    this.dialogRef.close(true);
  }
}
