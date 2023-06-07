import { Role } from 'src/app/lib/oa/directory/models';
import { ModelBase } from '../../core/models/model-base.model';
import { Profile } from '../../directory/models';
import { Device } from './device.model';

export class User extends ModelBase {
  role: Role;
  profile: Profile;
  email: string;
  phone: string;
  devices: Device[];

  constructor(obj?: any) {
    super();

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.timeStamp = obj.timeStamp;

    this.profile = new Profile(obj.profile);
    if (obj.role) {
      this.role = new Role(obj.role);
    }
    this.email = obj.email;
    this.phone = obj.phone;

    this.devices = obj.devices;
  }
}
