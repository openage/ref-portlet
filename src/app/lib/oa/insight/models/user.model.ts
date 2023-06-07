import { ModelBase } from '../../core/models/model-base.model';
import { IUser } from '../../core/models/user.interface';
import { Profile } from '../../directory/models';
export class User implements IUser {
  id: string;
  code: string;
  name: string;

  status: string;
  timeStamp: Date;

  phone: string;
  email: string;
  profile: Profile;
  constructor(obj?: any) {
    if (!obj) { return; }

    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;

    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
  }
}
