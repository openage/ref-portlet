import { ModelBase } from '../../core/models';
import { Project } from './project.model';
import { Release } from './release.model';
import { Sprint } from './sprint.model';
import { Task } from './task.model';
import { User } from './user.model';

export class TimeLog extends ModelBase {
  comment: string;
  activity: string;

  date: Date;
  minutes: number;
  user: User;
  task: Task;
  project: Project;
  release: Release;
  sprint: Sprint;

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.comment = obj.comment;
    this.activity = obj.activity;
    this.date = obj.date;
    this.minutes = obj.minutes || 0;

    if (obj.user) { this.user = new User(obj.user); }
    if (obj.task) { this.task = new Task(obj.task); }
    if (obj.project) { this.project = new Project(obj.project); }
    if (obj.release) { this.release = new Release(obj.release); }
    if (obj.sprint) { this.sprint = new Sprint(obj.sprint); }
  }
}
