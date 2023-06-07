import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UxService } from 'src/app/core/services/ux.service';
import { Entity, IUser } from '../../core/models';
import { RoleService } from '../../core/services';
import { Doc } from '../../drive/models';
import { DocsService } from '../../drive/services';
import { Category, Release, Sprint, TimeLog } from '../models';
import { State } from '../models/state.model';
import { Task } from '../models/task.model';
import { TimeLine } from '../models/timeline.model';
import { Workflow } from '../models/workflow.model';
import { GatewayApi } from './gateway.api';

@Injectable()
export class TaskService extends GatewayApi<Task> {

  points = [{
    label: 'Unestimated',
    icon: 'oa-num-0',
    class: 'md',
    code: 0,
  }, {
    label: 'Trivial',
    icon: 'oa-num-1',
    class: 'md',
    code: 1
  }, {
    label: 'Small',
    icon: 'oa-num-2',
    class: 'md',
    code: 2
  }, {
    label: 'Medium',
    icon: 'oa-num-3',
    class: 'md',
    code: 3
  }, {
    label: 'Large',
    icon: 'oa-num-5',
    class: 'md',
    code: 5
  }, {
    label: 'Huge',
    icon: 'oa-num-8',
    class: 'md',
    code: 8
  }];

  priorities = [{
    label: 'Blocker',
    icon: 'mat-flag',
    class: 'l-1',
    code: 1
  }, {
    label: 'Urgent',
    icon: 'mat-flag',
    class: 'l-2',
    code: 2
  }, {
    label: 'Must have',
    icon: 'mat-outlined_flag',
    class: 'l-2',
    code: 3
  }, {
    label: 'Good to have',
    icon: 'mat-flag',
    class: 'l-3',
    code: 4,
    isDefault: true
  }, {
    label: 'Someday',
    icon: 'mat-outlined_flag',
    class: 'l-3',
    code: 5
  }];
  constructor(
    http: HttpClient,
    private auth: RoleService,
    private uxService: UxService,
    private docsService: DocsService
  ) {
    super('tasks', http, auth, uxService, (i) => new Task(i));
  }

  calculateProgress(issue: Task) {
    if (issue.status === 'done') {
      return 100;
    }
    if (!issue.burnt && issue.status === 'wip') {
      return 20;
    }
    if (!issue.points || !issue.burnt) {
      return 0;
    }
    return 100 * issue.points / issue.burnt;
  }

  updateSubject(issue: Task, subject: string): Observable<Task> {

    const updateSubject = new Subject<Task>();
    const oldSubject = issue.subject;
    issue.isProcessing = true;
    issue.subject = subject;
    this.update(issue.id, { subject }).subscribe(() => {
      issue.isProcessing = false;
      updateSubject.next(issue);
    }, (err) => {
      issue.subject = oldSubject;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.next(issue);
    });
    return updateSubject;
  }

  updateDescription(issue: Task, description: string): Observable<string> {

    const updateSubject = new Subject<string>();
    const oldDescription = issue.description;
    issue.description = description;
    issue.isProcessing = true;
    this.update(issue.id || issue.code, { description }).subscribe(() => {
      issue.isProcessing = false;
      updateSubject.next(description);
    }, (err) => {
      issue.description = oldDescription;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.next(oldDescription);
    });
    return updateSubject;
  }

  updateMeta(issue: Task, meta: any): Observable<Task> {
    const updateSubject = new Subject<Task>();
    const oldMeta = issue.meta;
    issue.meta = meta;
    issue.isProcessing = true;
    this.update(issue.id, {
      meta
    }).subscribe(() => {
      issue.isProcessing = false;
      updateSubject.next(issue);
    }, (err) => {
      issue.priority = oldMeta;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.next(issue);
    });
    return updateSubject;
  }

  updatePoints(issue: Task, points: number): Observable<Task> {

    const updateSubject = new Subject<Task>();
    const oldPoints = issue.points;
    issue.points = points;
    issue.isProcessing = true;
    this.update(issue.id, { points }).subscribe(() => {
      issue.isProcessing = false;
      updateSubject.next(issue);
    }, (err) => {
      issue.points = oldPoints;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.next(issue);
    });
    return updateSubject;
  }

  updateDependsOn(issue: Task, item: Task, remove: boolean) {
    const updateSubject = new Subject<Task>();
    const dependsOn = issue.dependsOn;
    issue.isProcessing = true;
    let model
    model = { dependsOn: { code: item.code } }
    if (remove) {
      model.dependsOn.remove = true
    }
    this.update(issue.id, model).subscribe((item) => {
      issue.isProcessing = false;
      updateSubject.next(item);
    }, (err) => {
      issue.dependsOn = dependsOn;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.next(issue);
    });
    return updateSubject;
  }


  updateSize(issue: Task, size: number): Observable<Task> {

    const updateSubject = new Subject<Task>();
    const oldSize = issue.size;
    issue.size = size;
    issue.isProcessing = true;
    this.update(issue.id, { size }).subscribe(() => {
      issue.isProcessing = false;
      updateSubject.next(issue);
    }, (err) => {
      issue.size = oldSize;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.next(issue);
    });
    return updateSubject;
  }

  updateStatus(issue: Task, status: State): Observable<Task> {

    const subject = new Subject<Task>();
    const oldStatus = issue.currentStatus;
    const oldBurnt = issue.burnt;

    const model: any = {
      status: { code: status.code }
    };

    if (status.isFinal) {
      if (status.isCancelled) {
        model.burnt = 0;
        model.points = 0;
      } else {
        model.burnt = issue.points;
      }
    }

    issue.isProcessing = true;
    this.update(issue.id, model).subscribe((i) => {
      issue.isProcessing = false;
      issue.currentStatus = new State(i.status);
      subject.next(i);
    }, (err) => {
      issue.currentStatus = oldStatus;
      issue.burnt = oldBurnt;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      subject.next(issue);
    });
    return subject;
  }

  updatePriority(issue: Task, priority: number): Observable<Task> {
    const updateSubject = new Subject<Task>();
    const oldPriority = issue.priority;
    issue.priority = priority;
    issue.isProcessing = true;
    this.update(issue.id, {
      priority
    }).subscribe(() => {
      issue.isProcessing = false;
      updateSubject.next(issue);
    }, (err) => {
      issue.priority = oldPriority;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.next(issue);
    });
    return updateSubject;
  }

  updatePlan(issue: Task, plan: TimeLine): Observable<Task> {
    const updateSubject = new Subject<Task>();
    const oldValue = issue.plan;
    issue.plan = plan;
    issue.isProcessing = true;
    this.update(issue.id, {
      plan
    }).subscribe(() => {
      issue.isProcessing = false;
      updateSubject.next(issue);
    }, (err) => {
      issue.plan = oldValue;
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.next(issue);
    });
    return updateSubject;
  }

  getAttachments = (item: Task | string): Doc[] => {
    const attachments: Doc[] = [];

    let text = '';

    if (typeof item === 'string') {
      text = item;
    } else {
      text = item.description || '';
    }

    if (!text) {
      return attachments;
    }
    const urls = text.match(/\b(https?:\/\/\S+(?:png|jpe?g|gif)\s*)\b/g);
    if (!urls) {
      return attachments;
    }
    urls.forEach((url) => {
      const attachment = new Doc();
      attachment.url = url;
      attachment.thumbnail = url;
      if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
        attachment.type = 'image/jpg';
      } else if (url.endsWith('.png')) {
        attachment.type = 'image/png';
      } else if (url.endsWith('.gif')) {
        attachment.type = 'image/gif';
      }
      attachments.push(attachment);
    });

    return attachments;
  }

  updateCategory(issue: Task, category: Category): Observable<Task> {
    const updateSubject = new Subject<Task>();
    issue.isProcessing = true;
    this.update(issue.id, { category }).subscribe(() => {
      issue.isProcessing = false;
      issue.category = category;
      updateSubject.next(issue);
    }, (err) => {
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.error(err);
    });
    return updateSubject;
  }

  updateOwner(issue: Task, user: IUser): Observable<Task> {

    const updateSubject = new Subject<Task>();
    issue.isProcessing = true;

    const oldValue = issue.owner;

    this.update(issue.id, {
      owner: {
        code: user.code,
        // email: user.email,
        role: { id: user.id }
      }
    }).subscribe(() => {
      issue.isProcessing = false;
      issue.owner = user;
      updateSubject.next(issue);
    }, (err) => {
      issue.isProcessing = false;
      issue.owner = oldValue;
      this.uxService.handleError(err);
      updateSubject.error(err);
    });
    return updateSubject;
  }

  updateAssignee(issue: Task, user: IUser): Observable<Task> {

    const updateSubject = new Subject<Task>();
    issue.isProcessing = true;

    const oldValue = issue.assignee;
    const newValue = user ? {
      code: user.code,
      // email: user.email,
      role: { id: user.id }
    } : null;

    this.update(issue.id, {
      assignee: newValue
    }).subscribe(() => {
      issue.isProcessing = false;
      issue.assignee = user;
      updateSubject.next(issue);
    }, (err) => {
      issue.isProcessing = false;
      issue.assignee = oldValue;
      this.uxService.handleError(err);
      updateSubject.error(err);
    });
    return updateSubject;
  }

  updateSprint(issue: Task, sprint: Sprint): Observable<Task> {

    const updateSubject = new Subject<Task>();
    const oldSprint = issue.sprint;

    issue.isProcessing = true;
    this.update(issue.id, { sprint: { id: sprint.id } }).subscribe(() => {
      issue.isProcessing = false;
      issue.sprint = sprint;
      updateSubject.next(issue);
    }, (err) => {
      issue.isProcessing = false;
      issue.sprint = oldSprint;
      this.uxService.handleError(err);
      updateSubject.error(err);
    });
    return updateSubject;
  }

  updateParent(issue: Task, task: Task): Observable<Task> {

    const updateSubject = new Subject<Task>();
    const oldParent = issue.parent;

    issue.isProcessing = true;
    this.update(issue.id, { parent: { id: task.id } }).subscribe(() => {
      issue.isProcessing = false;
      issue.parent = task;
      updateSubject.next(issue);
    }, (err) => {
      issue.isProcessing = false;
      issue.parent = oldParent;
      this.uxService.handleError(err);
      updateSubject.error(err);
    });
    return updateSubject;
  }

  updateRelease(issue: Task, release: Release): Observable<Task> {

    const updateSubject = new Subject<Task>();
    const oldValue = issue.release;

    issue.isProcessing = true;
    this.update(issue.id, { sprint: { id: release.id } }).subscribe(() => {
      issue.isProcessing = false;
      issue.release = release;
      updateSubject.next(issue);
    }, (err) => {
      issue.isProcessing = false;
      issue.release = oldValue;
      this.uxService.handleError(err);
      updateSubject.error(err);
    });
    return updateSubject;
  }

  updateWorkflow(issue: Task, workflow: Workflow): Observable<Task> {

    const updateSubject = new Subject<Task>();
    const oldValue = issue.workflow;

    issue.isProcessing = true;
    this.update(issue.id, { workflow: { id: workflow.id, code: workflow.code } }).subscribe(() => {
      issue.isProcessing = false;
      issue.type = workflow.code;
      issue.workflow = workflow;
      updateSubject.next(issue);
    }, (err) => {
      issue.isProcessing = false;
      issue.type = oldValue.code;
      issue.workflow = oldValue;
      this.uxService.handleError(err);
      updateSubject.error(err);
    });
    return updateSubject;
  }

  updateBulk(issue: Task, model: any, query?: any) {
    const updateSubject = new Subject<Task>();
    let path = 'bulk'

    const params = new URLSearchParams();
    for (const key in query) {
      if (query[key] !== undefined) {
        params.set(key, query[key]);
      }
    }
    const queryString = params.toString();
    if (queryString) {
      path = `${path}?${queryString}`;
    }

    issue.isProcessing = true;
    this.bulk(model, path).subscribe(() => {
      issue.isProcessing = false;
      updateSubject.next(issue);
    }, (err) => {
      issue.isProcessing = false;
      this.uxService.handleError(err);
      updateSubject.error(err);
    });
    return updateSubject;
  }

  getBulkUpdateModel(action: string) {
    let model: any = { status: {} }
    switch (action) {
      case 'done':
        model.status.isFinal = true;
        break;
      case 'reset':
        model.status.isFirst = true;
        break;
      case 'discard':
        model.status.isFinal = true;
        model.status.isCancelled = true;
        break;
      default:
        break;
    }
    return model
  }

  getBulkUpdateQuery(task: Task, type: string) {
    let query
    switch (type) {
      case 'children':
        query = { 'parent': task.id, 'include-closed': true, 'include-draft': true, 'include-discarded': false }
        break;
      case 'dependsOn':
        query = { 'dependsOn-code': task.code, 'include-closed': true, 'include-draft': true, 'include-discarded': false }
        break;
      default:
        break;
    }
    return query
  }

  attach(issue: Task, file): Observable<Doc> {
    issue.isProcessing = true;
    const subject = new Subject<Doc>();
    this.docsService.createByEntity(new Entity({
      id: issue.id,
      type: 'issue'
    }), file).subscribe((doc) => {
      issue.isProcessing = false;
      subject.next(doc);

      // const imageUrl = doc.url;
      // if (issue && imageUrl) {
      //   this.updateDescription(issue, `${issue.description || ''}<div><img class="thumbnail" src="${imageUrl}"></div>`).subscribe(() => {
      //     issue.isProcessing = false;
      //     subject.next(doc);
      //   }, (err) => {
      //     issue.isProcessing = false;
      //     subject.error(err);
      //     this.uxService.handleError(err);
      //   } );
      // }
    }, (err) => {
      issue.isProcessing = false;
      subject.error(err);
      this.uxService.handleError(err);
    });

    return subject.asObservable();
  }

  logTime(issue: Task, timeLog: TimeLog) {
    timeLog.task = issue;
    issue.isProcessing = true;
    return this.post(timeLog, `${issue.id}/timeLogs`).subscribe(() => {
      issue.isProcessing = false;
    }, (err) => {
      issue.isProcessing = false;
      this.uxService.handleError(err);
    });
  }

  refresh(issue) {
    return this.get(issue.id).subscribe((i) => {
      issue.size = i.size;
      issue.isProcessing = false;
    }, (err) => {
      issue.isProcessing = false;
      this.uxService.handleError(err);
    });
  }

  getByEntity(entity: Entity | any, workflow: string | Workflow, options?: {
    template: string,
    meta: any,
    status: any,
    parent: any,
    owner: any,
    project: string,
    members: any,
    organization: any,
    actual: any,
    plan: any;
  }): Observable<Task> {
    const workflowCode = workflow instanceof Workflow ? workflow.code : workflow;
    const code = `byEntity?type=${workflowCode}&entity-id=${entity.id}&entity-type=${entity.type}`;
    // const code = `${entity.type}:${entity.id}:${workflowCode}`;

    const subject = new Subject<Task>();
    this.get(code, {
      handleError: (err) => {
        if (err.message === 'RESOURCE_NOT_FOUND' && options) {
          this.create({
            entity,
            meta: options.meta,
            status: options.status,
            template: { code: options.template },
            type: workflowCode,
            parent: options.parent ? {
              id: options.parent.id,
              code: options.parent.code
            } : null,
            owner: options.owner,
            project: options.project,
            members: options.members ? options.members : [],
            organization: options.organization,
            actual: options.actual,
            plan: options.plan
          }).subscribe((t) => subject.next(t));
        }
      }
    }).subscribe((t) => subject.next(t));

    return subject.asObservable();
  }

  hasMembership(task: Task, role: string) {

    const currentUser = this.auth.currentUser();
    if (!currentUser) { return false; }

    if (!task || !task.members || task.members.length === 0) { return false; }

    const member = task.members.find((m) => m.user && (m.user.email === currentUser.email));
    if (!member || !member.roles || member.roles.length === 0) {
      return false;
    }

    if (member.roles && member.roles.includes(role)) {
      return true;
    } else {
      return false;
    }
  }
}
