import { Component, ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';

import { Message } from 'src/app/lib/oa/send-it/models';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Entity } from '../../core/models';
import { Conversation } from '../models/conversation.model';
import { ConversationService } from '../services/conversation.service';

@Directive()
export class NoteListBaseComponent extends PagerModel<Message> implements OnChanges {

  @Input()
  entity: Entity;

  @Input()
  unread = false;

  @Input()
  sort = 'date';

  @Input()
  conversation: Conversation;

  selectedSubject: string;

  constructor(
    private conversationService: ConversationService,
    private api: MessageService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['conversation-id', 'subject'],
      pageOptions: { limit: 20 }
    });

    this.api.afterCreate.subscribe((message: Message) => {
      if (this.conversation && message.conversation && message.conversation.id === this.conversation.id) {
        if (!this.items.find((i) => i.id === message.id)) {
          this.items.push(message);
        }
      }
    });
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    if (this.conversation) {
      this.getMessages();
    } else if (this.entity) {
      this.conversationService.getByEntity(this.entity).subscribe((c) => {
        this.conversation = c;
        this.getMessages();
      });
    }
  }

  getMessages() {
    this.filters.properties['conversation-id'].value = this.conversation.id;

    if (this.selectedSubject) {
      this.filters.properties['subject'].value = this.selectedSubject;
    }
    this.fetch();
  }
}
