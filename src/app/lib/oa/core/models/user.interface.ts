import { Profile } from '../../directory/models';

export class IUser {
  id?: string | number;
  code?: string;
  phone: string;
  email: string;
  profile: Profile;
  status?: string;
  timeStamp?: Date;

  role?: any;

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.phone = obj.phone;
    this.email = obj.email;
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
    this.profile = new Profile(obj.email);
    this.role = obj.role;
  }

}
