import { IUser } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';
import { User } from './user.model';


export class TargetTeamMember extends ModelBase {
  value: number;
  achieved: number;
  status: string;
  user: IUser;

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }
    this.value = obj.value;
    this.achieved = obj.achieved;
    this.status = obj.status;

    if (obj.user) {
      this.user = new User(obj.user);
    }
  }
}
