import { ModelBase } from '../../core/models/model-base.model';

export class Division extends ModelBase {
  name: string;
  isEdit = false;
  code: string;
  constructor(obj?: any) {
    super();

    if (!obj) {
      return;
    }

    this.isEdit = obj.isEdit;
    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
  }
}
