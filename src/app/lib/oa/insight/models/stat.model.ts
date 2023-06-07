export class Stat {
  code: string;
  icon: string;
  label: string;
  value: any;

  constructor(obj?: any) {
    if (!obj) { return; }

    this.code = obj.code;
    this.icon = obj.icon;
    this.label = obj.label;
    this.value = obj.value;
  }
}
