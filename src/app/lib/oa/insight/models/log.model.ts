import { ModelBase } from '../../core/models/model-base.model';
import { Organization } from '../../directory/models/organization.model';
import { User } from './user.model';

export class Log extends ModelBase {
  level: string;
  message: string;
  date: Date;

  device: any;
  meta: any;

  error: any;
  app: string;
  location: string;

  context: {
    id: string,
    ipAddress: string,
    session: {
      id: string
    }
  };

  user: User;
  organization: Organization;

  constructor(obj?: any) {
    super(obj);

    if (!obj) { return; }

    this.level = obj.level;
    this.message = obj.message;
    this.date = obj.date || obj.timeStamp;

    this.app = obj.app;
    this.meta = obj.meta;
    this.error = obj.error;
    this.device = obj.device;
    this.location = obj.location;
    this.context = obj.context;

    if (obj.organization) {
      this.organization = new Organization(obj.organization);
    }

    if (obj.user) {
      this.user = new User(obj.entity);
    }
  }
}
