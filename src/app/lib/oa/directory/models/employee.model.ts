import { IUser } from '../../core/models';
import { Address } from '../../core/models/address.model';
import { ModelBase } from '../../core/models/model-base.model';
import { CustomFields } from './config.model';
import { Department } from './department.model';
import { Designation } from './designation.model';
import { Division } from './division.model';
import { Organization } from './organization.model';
import { Profile } from './profile.model';

export class Employee extends ModelBase implements IUser {
  designation: Designation;
  department: Department;
  division: Division;
  profile: Profile;
  email: string;
  phone: string;
  doj: Date;
  type: string;
  supervisor: Employee;
  config: CustomFields;
  address: Address;
  organization: Organization;
  role: {
    id: string
  }

  constructor(obj?: any) {
    super(obj);

    if (!obj) {
      return;
    }

    this.email = obj.email;
    this.phone = obj.phone;
    this.type = obj.type;
    this.doj = obj.doj;
    this.designation = new Designation(obj.designation);
    this.department = new Department(obj.department);
    this.division = new Division(obj.division);
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
    this.profile = new Profile(obj.profile);
    this.config = new CustomFields(obj.config);
    this.address = new Address(obj.address);
    this.supervisor = new Employee(obj.supervisor);
    this.organization = new Organization(obj.organization);
    this.role = obj.role;
  }
}
