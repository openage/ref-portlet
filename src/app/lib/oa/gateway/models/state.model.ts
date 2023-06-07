import { Observable } from 'rxjs';
import { ModelBase } from '../../core/models/model-base.model';

export class State extends ModelBase {

  estimate: number;
  isFirst: boolean;
  isDraft: boolean;
  isPaused: boolean;
  isCancelled: boolean;
  isComplete: boolean;
  isFinal: boolean;
  isDisabled = false;
  isSkipActionOnList: boolean;
  isAuto: boolean;
  style: string;
  icon: string;
  name: string;
  skipNext: boolean;
  dueDate: Date;
  assignee: any;
  before: () => boolean | Observable<boolean>;
  date: Date;

  next: State[] = [];
  action: string;
  permissions: string[];
  templates: [{
    code: string,
    name: string
  }];
  notifications: {
    statusChanged?: string,
    assigned?: string,
    updated?: string
  };
  meta: any;
  hooks: {
    trigger: {
      when: string, // values - before, after(default),
      entity: string,
      action: string
    },
    actions: [{
      code: string,
      handler: string, // values - frontend, backend (default)
      type: string, // http
      config: any // { "url": ":drive/docs/idcard/${data.code}", "action": "GET", "headers": {"x-role-key": "${context.role.key}" }
    }]
  }[] = [];

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }
    this.icon = obj.icon;

    this.action = obj.action;
    this.estimate = obj.estimate;
    this.isFirst = obj.isFirst;
    this.isDraft = obj.isDraft;
    this.isAuto = obj.isAuto;
    this.isPaused = obj.isPaused;
    this.isCancelled = obj.isCancelled;
    this.isFinal = obj.isFinal;
    this.isSkipActionOnList = obj.isSkipActionOnList;
    this.dueDate = obj.dueDate;
    this.date = obj.date;
    // this.next = obj.next ? obj.next.map((i) => new State(i)) : [];
    this.next = !obj.skipNext && obj.next ? obj.next.map((i) => { i.skipNext = true; return new State(i); }) : [];
    this.permissions = obj.permissions;
    this.hooks = obj.hooks || [];
    this.style = obj.style || 'default';

    this.assignee = obj.assignee;
    this.templates = obj.templates;
    this.meta = obj.meta;
    this.notifications = obj.notifications ? obj.notifications : {}
  }

}
