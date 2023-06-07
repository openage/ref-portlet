import { Pic } from 'src/app/lib/oa/core/models/pic.model';
import { User } from 'src/app/lib/oa/directory/models/user.model';
import { ModelBase } from '../../core/models/model-base.model';

export class Tenant extends ModelBase {

  // env: string;
  // host: string;
  logo: Pic;
  // joinUrl: string;
  // homeUrl: string;
  owner: User;

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }

    this.logo = new Pic(obj.logo);
    // this.joinUrl = obj.joinUrl;
    // this.homeUrl = obj.homeUrl;

    if (obj.owner) {
      this.owner = new User(obj.owner);
    }
  }
}
