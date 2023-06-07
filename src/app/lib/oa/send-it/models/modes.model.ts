
export class Modes {
  sms: boolean;
  email: boolean;
  push: boolean;
  chat: boolean;

  constructor(obj?: any) {
    if (!obj) { return; }

    this.sms = !!obj.sms;
    this.email = !!obj.email;
    this.push = !!obj.push;
    this.chat = !!obj.chat;
  }
}
