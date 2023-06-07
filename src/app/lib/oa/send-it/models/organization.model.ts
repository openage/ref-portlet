import { Template } from './template.model';
import { ModelBase } from '../../core/models/model-base.model';
import { User } from './user.model';

export class Organization extends ModelBase {
    name: string;
    owner: User;
    notifications: {
        enabled?: boolean;
        snooze?: Date;
        refusals?: Template[];
    };

    constructor(obj?: any) {
        super();

        if (!obj) {
            return;
        }

        this.id = obj.id;
        this.code = obj.code;
        this.name = obj.name;
        this.status = obj.status;
        this.timeStamp = obj.timeStamp;

        this.owner = new User(obj.owner);
        if (obj.notifications) {
            this.notifications = {
                enabled: obj.notifications.enabled,
                snooze: obj.notifications.snooze,
                refusals: (obj.notifications.refusals || []).map((t) => new Template(t))
            };
        } else {
            this.notifications = { refusals: [] };
        }

    }
}
