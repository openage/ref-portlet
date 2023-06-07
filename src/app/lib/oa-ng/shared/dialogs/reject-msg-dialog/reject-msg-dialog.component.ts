import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';

@Component({
  selector: 'shared-reject-msg-dialog',
  templateUrl: './reject-msg-dialog.component.html',
  styleUrls: ['./reject-msg-dialog.component.css']
})
export class RejectMsgDialogComponent implements OnInit {

  @Input()
  config: any = {};

  text: string;
  option: string;
  message: string;
  optionRequired: boolean = false;
  messageRequired: boolean = false;
  textRequired: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<RejectMsgDialogComponent>,
    private uxService: UxService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.config = this.config || {};
    this.config.hide = this.config.hide || {};
    this.config.cancel = this.config.cancel || {
      title: 'Cancel'
    };

    this.config.save = this.config.save || {
      title: 'Save'
    };
    this.config.title = this.config.title || 'Input';
    this.optionRequired = this.config.option && this.config.option.required ? true : false;
    this.messageRequired = this.config.message && this.config.message.required ? true : false;
    this.textRequired = this.config.text && this.config.text.required ? true : false;
  }

  messageUpdated($event) {
    this.message = this.uxService.getTextFromEvent($event);
  }

  onSave() {
    if (!this.message && this.option) {
      this.message = this.config.option.items.find((i) => i.key === this.option).label;
    }
    this.dialogRef.close({
      message: this.message,
      option: this.option,
      text: this.text,
      date: this.config?.date?.value
    });
  }

  isValid() {
    if ((this.optionRequired && !this.option) || (this.messageRequired && !this.message) || (this.textRequired && !this.text)) {
      return false;
    }

    return true;
  }

}
