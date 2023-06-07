import { IUser } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';
import { Profile } from '../../directory/models';
import { Points } from './points.model';

export class User extends ModelBase implements IUser {
  phone: string;
  email: string;
  profile: Profile;
  points: Points;
  role: {
    code: string;
    id: string;
  }

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }
    this.phone = obj.phone;
    this.email = obj.email;
    this.profile = new Profile(obj.profile);
    this.points = new Points(obj.points);
  }

}
