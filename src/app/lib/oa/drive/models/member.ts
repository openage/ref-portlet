import { IUser } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';

export class Member extends ModelBase {

    user: IUser;
    isFavourite: boolean;
    role: string;

    constructor(obj?: any) {
        super(obj);

        if (!obj) {
            return;
        }

        this.user = new IUser(obj.user);
        this.isFavourite = obj.isFavourite;
        this.role = obj.role;
    }
}
