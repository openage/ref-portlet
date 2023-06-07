import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { NewMessageBaseComponent } from 'src/app/lib/oa/send-it/components/new-message.base.component';
import { ConversationService, MessageService } from 'src/app/lib/oa/send-it/services';

@Component({
  selector: 'send-it-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent extends NewMessageBaseComponent implements OnInit, OnDestroy {

  @Input()
  paging: any;

  @Input()
  componentName: string;

  @Input()
  autoRefreshTime: number = 10;

  internalView: 'minimize' | 'button' | 'full' = 'button';

  unread: number;

  timeOut: any;



  constructor(
    conversationService: ConversationService,
    service: MessageService,
    private messageService: MessageService,
    private cache: LocalStorageService,
    private auth: RoleService
  ) {
    super(conversationService, service);
  }

  ngOnInit() {
    super.ngOnInit();
    this.checkLocalView();
    setTimeout(() => { this.checkCount() }, 2000)
  }

  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  autoRefresh() {
    this.timeOut = setTimeout(() => {
      if (this.auth.currentRole() && this.auth.currentRole().key) {
        this.checkCount();
      }
    }, (this.autoRefreshTime * 1000));
  }

  checkCount() {
    let query = {
      countOnly: true,
      status: 'delivered',
      'conversation-id': this.conversation.id,
      'conversation-entity-id': this.conversation.entity.id,
      'conversation-entity-type': this.conversation.entity.type
    }

    this.messageService.search(query).subscribe((page) => {
      this.unread = page.total;
      this.autoRefresh();
    })
  }

  checkLocalView() {
    let view = this.cache.components(`send-it|chat-box`).get('view');
    if (view) {
      this.internalView = view;
    }
  }

  setView(view) {
    this.internalView = view;
    this.cache.components(`send-it|chat-box`).set('view', view);
  }

  afterFetched(model) {
    let deliveredMsg = [];

    for (let item of model.items) {
      if (item.status === 'delivered') {
        item.status = 'viewed';
        deliveredMsg.push({ _id: item.id, status: item.status })
      }
    }

    if (deliveredMsg && deliveredMsg.length) {
      this.messageService.bulk(deliveredMsg, 'bulk')
    }
  }

}
