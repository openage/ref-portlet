import { ModelBase } from '../../core/models/model-base.model';
import { Role } from './role.model';
import { User } from './user.model';

export class Session extends ModelBase {
  app: string;
  user: User;
  expiry: Date;
  token: string;
  role: Role;

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }

    this.app = obj.app;
    this.expiry = obj.expiry;
    this.token = obj.token;
    this.user = new User(obj.user);
    this.role = new Role(obj.role);
  }
}
