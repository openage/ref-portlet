import { Component, ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';

import { Message } from 'src/app/lib/oa/send-it/models';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Conversation } from '../models/conversation.model';
import { ConversationService } from '../services/conversation.service';

@Directive()
export class ConversationDetailBaseComponent extends PagerModel<Message> implements OnInit, OnChanges {

  @Input()
  conversation: Conversation;

  @Input()
  unread = false;

  @Input()
  sort = 'date';

  @Input()
  mode: string;

  selectedSubject: string;

  constructor(
    private conversationService: ConversationService,
    private api: MessageService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      filters: ['conversation-id', 'subject', 'mode'],
      pageOptions: { limit: 20 }
    });
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    // eslint-disable-next-line max-len
    if (!this.conversation?.entity?.id) {
      return
    }
    this.conversationService.get(`entity?entity-id=${this.conversation?.entity?.id}&entity-type=${this.conversation?.entity?.type}&entity-name=${this.conversation?.entity?.name}`).subscribe((c) => {
      this.conversation = c;
      this.filters.properties['conversation-id'].value = this.conversation.id;

      if (this.selectedSubject) {
        this.filters.properties['subject'].value = this.selectedSubject;
      }
      if (this.mode) {
        this.filters.properties['mode'].value = this.mode;
      }
      this.fetch();

      this.api.afterCreate.subscribe((message: Message) => {
        if (this.conversation && message.conversation && message.conversation.id === this.conversation.id) {
          if (!this.items.find((i) => i.id === message.id)) {
            this.items.push(message);
          }
        }
      });
    });
  }
}
