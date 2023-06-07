import { Entity } from '../../core/models/entity.model';
import { Pic } from '../../core/models/pic.model';
import { User } from './user.model';

export class Conversation {
  id: string;
  name: string;
  description: string;
  type: 'direct' | 'group' | 'entity';

  pic: Pic;

  status: string;
  timeStamp: Date;

  entity: Entity;

  modes: string[];

  participants: User[];

  config: any = {};

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.name = obj.name;
    this.description = obj.description;
    if (obj.pic) {
      this.pic = new Pic(obj.pic);
    }
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
    this.config = obj.config;

    if (obj.entity) {
      this.entity = new Entity(obj.entity);
    }

    this.participants = [];
    if (obj.participants) {
      obj.participants.forEach((user) => {
        this.participants.push(new User(user));
      });
    }
  }
}
