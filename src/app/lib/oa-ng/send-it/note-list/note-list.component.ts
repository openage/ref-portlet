import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { NoteListBaseComponent } from 'src/app/lib/oa/send-it/components/note-list.base.component';
import { ConversationService, MessageService } from 'src/app/lib/oa/send-it/services';

@Component({
  selector: 'send-it-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent extends NoteListBaseComponent {

  constructor(
    messageService: MessageService,
    conversationService: ConversationService,
    uxService: UxService
  ) {
    super(conversationService, messageService, uxService);
  }
}
