import { Message } from './message.model';

export class SendItSummary {
  unread: number;
  total: number;
  actions: number;
  messages: Message[] = [];

  constructor(obj?: any) {
    if (!obj) { return; }

    this.unread = obj.unread;
    this.total = obj.total;
    this.actions = obj.actions;
    this.messages = [];

    if (obj.messages) {
      obj.messages.forEach((message) => {
        this.messages.push(new Message(message));
      });
    }
  }
}
