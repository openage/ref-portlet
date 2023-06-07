import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { ConversationDetailBaseComponent } from 'src/app/lib/oa/send-it/components/conversation-detail.base.component';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { ConversationService } from 'src/app/lib/oa/send-it/services/conversation.service';
import { NotificationDetailComponent } from '../notification-detail/notification-detail.component';
declare var $: any;
@Component({
  selector: 'send-it-conversation-detail',
  templateUrl: './conversation-detail.component.html',
  styleUrls: ['./conversation-detail.component.css']
})
export class ConversationDetailComponent extends ConversationDetailBaseComponent {

  @Input()
  view: string;

  constructor(
    messageService: MessageService,
    conversationService: ConversationService,
    uxService: UxService,
    public dialog: MatDialog
  ) {
    super(conversationService, messageService, uxService);
  }

  injectBody(elementId, body) {
    const el = document.getElementById(elementId);
    el.innerHTML = body;
  }

  open(item) {
    this.dialog.closeAll();
    if (!item.body) { return; }
    const dialogRef = this.dialog.open(NotificationDetailComponent, {
      minWidth: '530px',
      maxWidth: '820px'
    });

    const instance = dialogRef.componentInstance;
    instance.message = item;
    instance.hideGoTo = true;
    instance.showMsgTitle = true;
  }

}
