import { ModelBase } from '../../core/models/model-base.model';
import { Role } from './role.model';
import { Workflow } from './workflow.model';
export class ProjectType extends ModelBase {
  icon: string;
  description: string;

  roles: Role[];
  workflows: Workflow[];

  views: {
    code: string,
    name: string
  }[];

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.icon = obj.icon;
    this.description = obj.description;

    this.workflows = obj.workflows ? obj.workflows.map((i) => new Workflow(i)) : [];
    this.roles = obj.roles ? obj.roles.map((i) => new Role(i)) : [];
  }

}
