import { ModelBase } from '../../core/models/model-base.model';
import { Member } from './member.model';

export class Tenant extends ModelBase {
  members: Member[];
}
