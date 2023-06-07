import { Permission } from './permission.model';

export class PermissionGroup {
  code: string;
  name: string;
  description: string;

  permissions: Permission[] = [];

  constructor(obj?: any) {
    if (!obj) { return; }

    if (typeof obj === 'string') {
      this.code = obj;
      this.name = obj;
      return;
    }

    this.code = obj.code;
    this.name = obj.name || obj.code;
    this.description = obj.description;
    this.permissions = [];
    if (obj.permissions) {
      obj.permissions.forEach((p) => {
        p.group = this.code;
        this.permissions.push(new Permission(p));
      });
    }
  }
}
