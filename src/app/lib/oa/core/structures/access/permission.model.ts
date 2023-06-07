export class Permission {
  isEdit: boolean;
  group: string;
  code: string;
  name: string;
  description: string;

  constructor(obj?: any) {
    if (!obj) { return; }

    if (typeof obj === 'string') {
      this.code = obj;
      this.name = obj;
      this.group = 'default';
      return;
    }

    this.group = obj.group || 'default';
    this.code = obj.code;
    this.name = obj.name || obj.code;
    this.description = obj.description;
  }

}
