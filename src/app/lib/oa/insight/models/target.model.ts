import { IUser } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';
import { TargetTeamMember } from './target-team-member.model';
import { TargetType } from './target-type.model';
import { User } from './user.model';

export class Target extends ModelBase {
  date: Date;
  value: number;
  team: TargetTeamMember[];
  achieved: number;
  type: TargetType;
  user: IUser;
  meta: any;

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.date = obj.date;
    this.value = obj.value;
    this.achieved = obj.achieved;
    this.meta = obj.meta;

    if (obj.user) {
      this.user = new User(obj.user);
    }

    if (obj.type) {
      this.type = new TargetType(obj.type);
    }

    if (Array.isArray(obj.team)) {
      for (const member of obj.team) {
        this.team.push(new TargetTeamMember(member));
      }
    }
  }
}
