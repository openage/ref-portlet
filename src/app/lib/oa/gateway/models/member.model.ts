import { IUser } from '../../core/models';

export class Member {
  user: IUser;
  size: number;
  burnt: number;
  status: string;
  roles: string[];

  constructor(obj?: any) {
    if (!obj) { return; }

    this.user = obj.user;

    this.size = obj.size;
    this.burnt = obj.burnt;

    this.status = obj.status;

    this.roles = obj.roles || [];
  }
}
