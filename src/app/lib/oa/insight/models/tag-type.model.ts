import { Entity } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';

export class TagType extends ModelBase {

  entity: Entity;
  hooks: any[];
  options?: any[];

  constructor(obj?: any) {
    super();

    if (!obj) { return; }
    this.id = obj.id;
    this.entity = new Entity(obj.entity);
    this.hooks = obj.hooks;
    this.options = (obj.options || []).map((option) => ({ code: option.code, name: option.name }));
  }
}
