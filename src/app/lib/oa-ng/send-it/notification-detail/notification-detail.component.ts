import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Message } from 'src/app/lib/oa/send-it/models';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css'],
})
export class NotificationDetailComponent implements OnInit {
  @Input()
  message: Message;

  @Input()
  hideGoTo = false;

  @Input()
  showMsgTitle = false;

  constructor(
    public dialogRef: MatDialogRef<NotificationDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() { }

  onClick(): void {
    this.dialogRef.close();
  }

  injectBody(elementId: string, body: string) {
    const el = document.getElementById(elementId);
    el.innerHTML = body;
  }
}
