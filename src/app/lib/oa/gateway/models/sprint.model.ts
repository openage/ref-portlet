import { ModelBase } from '../../core/models/model-base.model';
import { Member } from './member.model';
import { Task } from './task.model';
import { TimeLine } from './timeline.model';

export class Sprint extends ModelBase {
  name: string;
  description: string;
  isClosed: boolean;

  points: number;
  burnt: number;

  plan: TimeLine;
  actual: TimeLine;

  members: Member[];
  tasks: Task[] = [];
  project: any;
  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.name = obj.name;
    this.description = obj.description;
    this.isClosed = obj.isClosed;

    this.points = obj.points;
    this.burnt = obj.burnt;

    this.plan = new TimeLine(obj.plan);
    this.actual = new TimeLine(obj.actual);

    this.project = obj.project;

    this.members = obj.members ? obj.members.map((i) => new Member(i)) : [];
    this.tasks = obj.tasks ? obj.tasks.map((i) => new Task(i)) : [];

  }
}
