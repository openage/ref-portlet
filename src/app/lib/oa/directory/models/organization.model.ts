import { IOrganization, Theme } from '../../core/models';
import { Address } from '../../core/models/address.model';
import { ModelBase } from '../../core/models/model-base.model';
import { Pic } from '../../core/models/pic.model';
import { IUser } from '../../core/models/user.interface';
import { Link } from '../../core/structures';
import { Service } from './service.model';
// import { Task } from './task.model';

export class Organization extends ModelBase implements IOrganization {
  type: string;
  logo: Pic;
  joinUrl: string;
  navs: Link[];
  services?: Service[];
  address: Address;
  email: string;
  phone: string;
  owner: IUser;
  task: any;
  theme?: Theme;

  constructor(obj?: any) {
    super(obj);

    if (!obj) {
      return;
    }

    this.type = obj.type;
    this.email = obj.email;
    this.phone = obj.phone;
    this.logo = new Pic(obj.logo);

    this.joinUrl = obj.joinUrl;
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
    this.address = new Address(obj.address);
    this.owner = obj.owner;
    this.theme = obj.theme;

    // this.task = new Task(obj.task)
    this.task = obj.task;


    if (obj.navs) {
      this.navs = obj.navs.map((n) => new Link(n));
    }

    this.services = [];

    if (obj.services) {
      obj.services.forEach((item) => {
        this.services.push(new Service(item));
      });
    }
  }
}
