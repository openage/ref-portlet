import { Action } from './action.model';
import { Conversation } from './conversation.model';
import { Message } from './message.model';
import { User } from './user.model';

export class Meta {
    actions: Action[];
    meta: Message;

    constructor(obj?: any) {

        if (!obj) {
            return;
        }

        this.actions = obj.actions;
        this.meta = obj.meta;
    }

}
