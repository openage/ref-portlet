import { Entity } from '../../core/models/entity.model';
import { ModelBase } from '../../core/models/model-base.model';
import { User } from './user.model';

export class Journal extends ModelBase {

  message: string;
  entity: Entity;
  user: User;
  type: string;
  changes: [{
    field: string,
    value: string,
    oldValue: string,
    text: string
  }];

  constructor(obj?: any) {
    super(obj);

    if (!obj) { return; }

    this.message = obj.message;
    this.type = obj.type;

    this.changes = obj.changes;

    if (obj.entity) {
      this.entity = new Entity(obj.entity);
    }
  }
}
