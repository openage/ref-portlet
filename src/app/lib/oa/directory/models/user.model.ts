import { IUser } from '../../core/models/user.interface';
import { Profile } from './profile.model';
import { Role } from './role.model';

export class User implements IUser {
  code: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  profile: Profile;
  roles: Role[];
  status: string;
  timeStamp: Date;
  meta: any;

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.timeStamp = obj.timeStamp;

    this.code = obj.code;
    this.name = obj.name;
    this.email = obj.email;
    this.phone = obj.phone;

    this.meta = obj.meta || {};

    if (obj.profile) {
      this.profile = new Profile(obj.profile);
    }

    this.roles = [];

    if (obj.roles) {
      obj.roles.forEach((item) => {
        this.roles.push(new Role(item));
      });
    }
  }
}
