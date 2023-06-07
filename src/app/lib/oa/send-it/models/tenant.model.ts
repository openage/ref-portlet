
import { ModelBase } from '../../core/models/model-base.model';
import { User } from './user.model';

export class Tenant extends ModelBase {
    name: string;
    owner: User;

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
    }
}
