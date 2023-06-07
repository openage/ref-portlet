import { ModelBase } from '../../core/models/model-base.model';
import { Member } from './member.model';
import { Project } from './project.model';

export class Category extends ModelBase {
  color: string;
  icon: string;
  description: string;
  members: Member[] = [];
  project: Project;

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.color = obj.color;
    this.icon = obj.icon;
    this.description = obj.description;
    this.members = (obj.members || []).map(member => new Member(member));
    this.project = new Project(obj.project);
  }
}
