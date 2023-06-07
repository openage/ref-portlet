import { ModelBase } from '../../core/models/model-base.model';

export class CalendarEvent extends ModelBase {
  label: string;
  date: Date;
  value: any;
  template: string;
  code: string;
  hrs?: number;
  areaCode?: string;

  constructor(obj?: any) {
    super(obj);
    if (!obj) return;
    this.label = obj.label || obj.name;
    this.date = obj.date;
    this.template = obj.template;
    this.value = obj.value;
    this.code = obj.code;
    this.hrs = obj.hrs;
    this.areaCode = obj.areaCode;
  }
}
