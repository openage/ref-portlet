import { Address, Entity, IUser } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';
import { Category } from './category.model';
import { Member } from './member.model';
import { Organization } from './organization.model';
import { State } from './state.model';
import { TimeLine } from './timeline.model';
import { User } from './user.model';
import { Workflow } from './workflow.model';

export class Task extends ModelBase {
  id: string;
  subject: string;
  description: string;
  createdOn: Date;
  currentStatus: State;
  entity: Entity;

  template: any;
  effort: number;
  points: number;
  burnt: number;

  plan: TimeLine;
  actual: TimeLine;

  type: string;
  priority: number;
  size: number;

  owner: IUser;
  members: Member[];
  meta: any;
  parent: Task;
  children: Task[];
  isClosed: boolean;

  category: Category;
  sprint: any;
  release: any;
  project: any;
  workflow: Workflow;
  assignee: IUser;
  dueDate: Date;
  tags: string[];
  changes: any[];
  group: string;
  address: Address;
  dependsOn: Task[];
  icon: string;
  organization: Organization;

  journals: {
    user: IUser,
    timeStamp: Date,
    state: State
  }[];
  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    this.id = obj.id;
    this.subject = obj.subject;
    this.description = obj.description;
    if (obj.entity) { this.entity = new Entity(obj.entity); }
    this.createdOn = obj.createdOn;
    this.effort = obj.effort;
    this.points = obj.points;
    this.burnt = obj.burnt;
    this.size = obj.size;
    this.isClosed = obj.isClosed;
    this.plan = new TimeLine(obj.plan);
    this.actual = new TimeLine(obj.actual);
    this.icon = obj.icon;

    this.type = obj.type;
    this.priority = obj.priority || 3;
    this.address = new Address(obj.address);

    if (obj.owner) { this.owner = new User(obj.owner); }
    this.members = obj.members ? obj.members.map((i) => new Member(i)) : [];

    if (obj.parent) { this.parent = new Task(obj.parent); }
    this.children = obj.children ? obj.children.map((i) => new Task(i)) : [];

    this.tags = obj.tags || [];
    this.dependsOn = obj.dependsOn ? obj.dependsOn.map((i) => new Task(i)) : [];

    if (obj.workflow) {
      this.workflow = new Workflow(obj.workflow);
    }
    this.meta = obj.meta || {};
    this.organization = new Organization(obj.organization);

    // this.currentStatus = obj.status ?
    //   this.workflow.states.find((s) => s.code === obj.status.code) :
    //   this.workflow.states.find((s) => s.isFirst);
    this.currentStatus = new State(obj.status);
    if (this.workflow && this.workflow.states && this.workflow.states.length && this.currentStatus) {
      const state = this.workflow.states.find((s) => s.code === this.currentStatus.code);

      if (state) {
        this.currentStatus.next = state.next;
        this.currentStatus.meta = state.meta;
      }
    }
    this.status = this.currentStatus.code;

    if (obj.category) { this.category = new Category(obj.category); }
    if (obj.sprint) { this.sprint = obj.sprint; }
    if (obj.release) { this.release = obj.release; }
    if (obj.project) { this.project = obj.project; }

    if (obj.assignee) { this.assignee = new User(obj.assignee); }
    if (obj.changes) {this.changes = obj.changes}

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
