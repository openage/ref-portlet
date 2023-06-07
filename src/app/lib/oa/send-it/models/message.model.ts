import { ModelBase } from '../../core/models';
import { Entity } from '../../core/models/entity.model';
import { Conversation } from './conversation.model';
import { Modes } from './modes.model';
import { User } from './user.model';

export class Message extends ModelBase {
  date: Date;

  to: {
    user: User,
    deliveredOn?: Date,
    viewedOn?: Date,
    processedOn?: Date,
    archivedOn?: Date
  }[];
  from: User;

  modes: Modes = new Modes({
    sms: false,
    email: false,
    push: false,
    chat: true
  });
  options: any = {};

  subject: string;
  body: string;
  data: any = {};
  template: string;

  conversation: Conversation;

  permissions: string[];  // need to post this model

  attachments: {
    filename: string,
    url: string,
    mimeType: string
  }[];

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }
    this.body = obj.body;
    this.subject = obj.subject;

    this.to = [];
    if (obj.to && obj.to.length) {
      obj.to.forEach((to) => {
        this.to.push({
          user: to.user || to,
          deliveredOn: to.deliveredOn,
          viewedOn: to.viewedOn,
          archivedOn: to.archivedOn
        });
      });
    }
    this.template = obj.template;
    this.date = obj.date;
    this.data = obj.data;
    this.options = obj.options || {}
    if (obj.conversation) {
      this.conversation = new Conversation(obj.conversation);
    }

    if (obj.modes) {
      this.modes = new Modes(obj.modes);
    }
  }
}
