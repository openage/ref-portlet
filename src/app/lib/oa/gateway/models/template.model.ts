import { ModelBase } from '../../core/models/model-base.model';
import { Workflow } from './workflow.model';

export class Template extends ModelBase {

  assignee: string;
  description: string;
  subject: string;
  workflow: Workflow;
  priority: number;
  size: number;
  tags: string[];
  icon: string;

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }

    this.assignee = obj.assignee;
    this.description = obj.description;
    this.subject = obj.subject;
    this.workflow = new Workflow(obj.workflow);
    this.priority = obj.priority;
    this.size = obj.size;
    this.tags = obj.tags;
    this.icon = obj.icon;
  }
}
