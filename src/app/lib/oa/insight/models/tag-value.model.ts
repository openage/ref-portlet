import { ModelBase } from '../../core/models/model-base.model';

export class TagValue extends ModelBase {
  type?: {
    id: string,
    code: string,
    name: string,
  };

  constructor(obj?: any) {
    super();

    if (!obj) { return; }
    this.id = obj.id;
    this.type = obj.type;
  }
}
