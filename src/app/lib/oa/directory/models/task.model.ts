import { Entity, ModelBase } from '../../core/models';
import { Action } from '../../core/structures';

export class Task extends ModelBase {
  error: string;
  entity: Entity;
  action: Action;
  date: Date;
  progress: number;
  data: any = {};
  organization: any;

  constructor(obj?: any) {
    super(obj);

    if (!obj) {
      return;
    }

    this.error = obj.error;
    this.entity = new Entity(obj.entity);
    this.action = new Action(obj.action);
    this.date = obj.date;
    this.progress = obj.progress;
    this.data = obj.data || {};
    this.organization = obj.organization;
  }
}
