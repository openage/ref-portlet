import { Entity } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';
import { TagValue } from './tag-value.model';

export class Tag extends ModelBase {

  entity: Entity;
  values: TagValue[] = [];

  constructor(obj?: any) {
    super();

    if (!obj) { return; }
    this.id = obj.id;
    this.entity = new Entity(obj.entity);
    this.values = (obj.values || []).map((value) => new TagValue(value));
  }
}
