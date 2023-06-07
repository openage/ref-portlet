import { ModelBase } from '../../core/models/model-base.model';

export class Contractor extends ModelBase {
  name: string;
  isEdit: boolean;

  constructor(obj?: any) {
    super(obj);

    if (!obj) {
      return;
    }
  }
}
