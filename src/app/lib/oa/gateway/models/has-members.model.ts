import { Entity } from '../../core/models/entity.model';
import { Member } from './member.model';

export class HasMembers extends Entity {

  members: Member[];
}
