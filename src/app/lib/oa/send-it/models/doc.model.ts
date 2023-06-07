import { User } from './user.model';

export class Doc {
    name: string;
    url: string;
    content: string;
    type: string;
    status: string; // preview

    author: User;
    timeStamp: Date;

    constructor(obj?: any) {

        if (!obj) {
            return;
        }

        this.name = obj.name;
        this.url = obj.url;
        this.content = obj.content;
        this.type = obj.type;

        this.status = obj.status;
        this.timeStamp = obj.timeStamp;

        if (obj.author) {
            this.author = new User(obj.author);
        }
    }
}
