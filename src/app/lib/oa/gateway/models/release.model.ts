import { IUser, ModelBase } from '../../core/models';
import { Member } from './member.model';
import { State } from './state.model';
import { Task } from './task.model';
import { TimeLine } from './timeline.model';
import { Workflow } from './workflow.model';

export class Release extends ModelBase {
  description: string;
  type: string;
  points: number;
  plan: TimeLine;
  actual: TimeLine;
  members: Member[];
  tasks: Task[] = [];
  project: any;
  isClosed: boolean;
  workflow: Workflow;
  currentStatus: State;
  journals: {
    user: IUser,
    timeStamp: Date,
    state: State
  }[];
  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.description = obj.description;
    this.type = obj.type;

    this.points = obj.points;
    this.isClosed = obj.isClosed;

    this.plan = new TimeLine(obj.plan);
    this.actual = new TimeLine(obj.actual);

    this.members = obj.members ? obj.members.map((i) => new Member(i)) : [];
    this.tasks = obj.tasks ? obj.tasks.map((i) => new Task(i)) : [];

    this.project = obj.project;

    if (obj.workflow) {
      this.workflow = new Workflow(obj.workflow);
    }

    this.currentStatus = new State(obj.status);
    if (this.workflow && this.workflow.states && this.workflow.states.length && this.currentStatus) {
      const state = this.workflow.states.find((s) => s.code === this.currentStatus.code);

      if (state) {
        this.currentStatus.next = state.next;
        this.currentStatus.meta = state.meta;
      }
    }
    this.status = this.currentStatus.code;
    this.journals = (obj.journals || []).map((j) => {
      return {
        user: j.user,
        timeStamp: j.timeStamp,
        state: {
          code: j.state.code,
          name: j.state.name,
          isFinal: j.state.isFinal,
          date: j.state.date
        }
      };
    });
  }
}
