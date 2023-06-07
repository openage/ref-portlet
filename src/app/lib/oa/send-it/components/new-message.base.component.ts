import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { Observable } from 'rxjs';

import { Message, User } from 'src/app/lib/oa/send-it/models';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { ConversationService } from 'src/app/lib/oa/send-it/services';
import { Entity, IUser } from '../../core/models';
import { Conversation } from '../models/conversation.model';
import { Modes } from '../models/modes.model';

@Directive()
export class NewMessageBaseComponent implements OnInit {

  @Input()
  view: string;

  @Input()
  conversation: Conversation;

  @Input()
  entity: Entity;

  @Input()
  to: any[] = [];

  @Input()
  modes: any;

  @Input()
  toolbar: any[] = [
    ['bold', 'italic', 'underline'],        // toggled buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: new Array<any>() }]
  ];

  @Input()
  attachments: {
    filename: string,
    url: string,
    mimeType: string
  }[];

  @Input() template: any;

  @Input() data: any;

  @Input()
  beforeSend: (m: Message) => Observable<boolean>;

  @Output()
  sent: EventEmitter<Message> = new EventEmitter();

  @Output()
  addAttachment: EventEmitter<boolean> = new EventEmitter();

  @Input()
  message: Message = new Message();

  content: string;

  errors: string[] = [];

  @Input()
  isProcessing = false;

  afterProcessing: () => void;

  @Input()
  toCustomers: User[] = [];

  @Input()
  toInternal: User[] = [];

  constructor(
    private conversationService: ConversationService,
    private service: MessageService
  ) { }

  ngOnInit() {
    if (this.to && this.to.length) {
      this.to.forEach((e) => {
        this.addDefaultTo(e);
      });
    }
    if (this.toCustomers) {
      this.toCustomers.forEach((e) => {
        this.addDefaultTo(e);
      });
    }
    if (this.toInternal) {
      this.toInternal.forEach((e) => {
        this.addDefaultTo(e);
      });
    }
    if (this.modes) {
      this.message.modes = new Modes(this.modes);
    }
    if (this.attachments && this.attachments.length) {
      this.message.attachments = [...this.attachments];
    }
    if (this.template) {
      this.message.template = this.template;
    }
    if (this.data) {
      this.message.data = this.data;
    }
  }

  setSubject(subject: string) {
    this.message.subject = subject;
  }

  setContent($event: string) {
    this.message.body = $event;
  }

  send() {
    if (!this.message.subject.trim()) {
      this.errors = [];
      this.errors.push('message cannot be empty');
      return;
    }

    this.isProcessing = true;
    this.message = this.filterTo(this.message)
    if (this.conversation) {
      this.createMessage();
    } else if (this.entity) {
      this.conversationService.getByEntity(this.entity).subscribe((c) => {
        this.conversation = c;
        this.createMessage();
      });
    }
    this.message.subject = '';
  }

  filterTo(message) {
    if (message.to) {
      message.options["to"] = message.to.filter(t => !(t.user.role && t.user.role.id)).map(t => t.user)
      message.to = message.to.filter(t => (t.user.role && t.user.role.id))
    }
    return message;
  }

  createMessage() {
    this.message.conversation = this.conversation;
    this.service.create(this.message).subscribe((message) => {
      this.isProcessing = false;
      this.sent.emit(message);
      this.message = new Message(message);
      if (this.afterProcessing) { this.afterProcessing(); }
    }, (err) => {
      this.isProcessing = false;
      this.errors = [];
      this.errors.push(err);
    });
  }

  addDefaultTo(data) {

    const pushUser = (user) => {
      user.isSelected = true;
      this.message.to = this.message.to || [];
      if (!this.toExists(user)) {
        this.message.to.push({ user });
      }
    };

    if (!data) { return; }

    if (typeof data === 'string') {
      const user = new User({ email: data });
      pushUser(user);
    } else if (typeof data === 'object') {
      const user = new User(data);
      pushUser(user);
    }
  }

  toExists(user: User) {
    return this.message.to.find((to) => {
      if (user.id) {
        return to.user.id === user.id;
      }

      if (user.role && user.role.id && to.user && to.user.role && to.user.role.id) {
        return to.user.role.id === user.role.id;
      }

      if (user.email) {
        return to.user.email === user.email;
      }

      if (user.phone) {
        return to.user.phone === user.phone;
      }
    });
  }

  removeUser(user: User, options?: any) {
    // const removeItem = (userArr) => {

    //   return userArr.filter((to) => remover(to));
    // };

    const remover = (to) => {
      if (user.id) {
        return to.user.id !== user.id;
      }
      if (user.role && user.role.id) {
        return to.user.role.id !== user.role.id;
      }
      if (user.email) {
        return to.user.email !== user.email;
      }
      if (user.phone) {
        return to.user.phone !== user.phone;
      }
    }

    if (options?.typeOfUser === 'customer') {
      this.toCustomers = this.toCustomers.filter((user) => remover({ user }));
    } else if (options?.typeOfUser === 'internal') {
      this.toInternal = this.toInternal.filter((user) => remover({ user }));
    }

    this.message.to = this.message.to.filter((user) => remover(user));;

  }
}
