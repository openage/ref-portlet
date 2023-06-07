import { Component } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { NewMessageBaseComponent } from 'src/app/lib/oa/send-it/components/new-message.base.component';
import { ConversationService, MessageService } from 'src/app/lib/oa/send-it/services';

@Component({
  selector: 'send-it-note-editor',
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent extends NewMessageBaseComponent {

  placeholder = 'add';

  constructor(
    conversationService: ConversationService,
    service: MessageService,
    private uxService: UxService
  ) {
    super(conversationService, service);
  }

  onChanged($event) {
    const text = this.uxService.getTextFromEvent($event, { placeholder: this.placeholder });
    if (text) {
      this.message.subject = text;
      this.send();
    }
  }
}
