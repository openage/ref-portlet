import { Component, Input } from '@angular/core';
import { ConversationService, MessageService } from 'src/app/lib/oa/send-it/services';
import { NewMessageBaseComponent } from 'src/app/lib/oa/send-it/components/new-message.base.component';

@Component({
  selector: 'send-it-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent extends NewMessageBaseComponent {

  @Input()
  view: string;

  constructor(
    conversationService: ConversationService,
    service: MessageService
  ) {
    super(conversationService, service);
  }
}
