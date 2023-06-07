import { ModelBase } from '../../core/models/model-base.model';

export class Task extends ModelBase {
  id: string;
  status: string;
  progress: number;

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.id = obj.id;
    this.status = obj.status;
    this.progress = obj.progress;
  }
}
