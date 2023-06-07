
import { IUser } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';
import { Employee } from './employee.model';
import { Organization } from './organization.model';
import { Profile } from './profile.model';
import { RoleType } from './role-type.model';
import { User } from './user.model';

export class Role extends ModelBase {
  key: string;
  email: string;
  phone: string;
  type: RoleType;
  profile: Profile;
  timeStamp: Date;
  user?: IUser;
  employee?: Employee;
  organization?: Organization;
  task: any;
  permissions: string[] = [];
  supervisor: Role;

  constructor(obj?: any) {
    super(obj);

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.key = obj.key;
    this.email = obj.email;
    this.phone = obj.phone;
    this.type = new RoleType(obj.type);
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;

    this.supervisor = new Role(obj.supervisor)

    if (obj.profile) {
      this.profile = new Profile(obj.profile);
    }

    // this.task = new Task(obj.task);
    this.task = obj.task;

    if (obj.employee) {
      this.employee = new Employee(obj.employee);
      this.code = this.employee.code;
      if (obj.employee.profile) {
        this.profile = new Profile(obj.employee.profile);
      }
    }

    if (obj.profile && (obj.profile.firstName || obj.profile.lastName) && (!this.profile || !this.profile.firstName || !this.profile.lastName)) {
      this.profile = new Profile(obj.profile);
    }

    if (obj.user) {
      this.user = new User(obj.user);
      if (obj.user.profile) {
        this.profile = new Profile(obj.user.profile);
      }
    }

    if (obj.organization) {
      this.organization = new Organization(obj.organization);
    }

    this.permissions = [];
    if (obj.permissions) {
      obj.permissions.forEach((permission) => {
        this.permissions.push(permission);
      });
    }
  }
}
