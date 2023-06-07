import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { Category, Project, Release, Sprint, Task, User } from 'src/app/lib/oa/gateway/models';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { UxService } from 'src/app/core/services';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Entity, IUser } from '../../core/models';
import { DateService } from '../../core/services/date.service';
import { State } from '../models/state.model';
import { TimeLine } from '../models/timeline.model';
import { Workflow } from '../models/workflow.model';

@Directive()
export class TaskListBaseComponent extends PagerModel<Task> implements OnInit, OnChanges {

  @Input()
  release: Release | any;

  @Input()
  addRelease: Release;

  @Input()
  sprint: string | Sprint | Sprint[];

  @Input()
  type: string;

  @Input()
  placeholder = '';

  @Input()
  workflow: Workflow;

  @Input()
  category: Category;

  @Input()
  selectedStatus: string | State;

  @Input()
  text: string;

  @Input()
  project: Project | any;

  @Input()
  parent: Task | any;

  @Input()
  entity: Entity;

  @Input()
  assignee: string | User;

  @Input()
  assigneeByRole: string;

  @Input()
  owner: string | User;

  @Input()
  isClosed: boolean;

  @Input()
  isCancelled: boolean;

  @Input()
  isDraft: boolean;

  @Input()
  isDiscarded: boolean;

  @Input()
  includeDiscarded: boolean;

  @Input()
  includeDraft: boolean;

  @Input()
  includeClosed: boolean;

  @Input()
  details: string;

  @Input()
  expiringDays: string

  @Input()
  params: any;

  @Input()
  isHidden: string;

  @Input()
  tags: string;

  @Input()
  orderBy: any = { priority: 'asc' };

  @Input()
  endless: boolean;

  @Input()
  dependsOn: string | Task;

  @Input()
  exclude: string = 'members,children,sprint';

  @Input()
  include: string;

  @Output()
  taskUpdated: EventEmitter<Task> = new EventEmitter();

  @Output()
  selected: EventEmitter<any> = new EventEmitter();

  @Output()
  refresh: EventEmitter<any> = new EventEmitter();

  @Output()
  onSelectedTag: EventEmitter<string> = new EventEmitter();

  afterProcessing: () => void;
  oaBeforeFetch: () => void;
  oaAfterFetch: () => void;

  @Input()
  selectedCode: string;
  selectedSubject: string;

  constructor(
    private api: TaskService,
    public uxService: UxService,
    errorHandler: ErrorHandler,
    public dateService: DateService
  ) {
    super({
      api,
      errorHandler,
      pageOptions: {
        limit: 10
      },
      filters: [
        'project', 'project-id', 'project-code',
        'release', 'release-id', 'release-code',
        'sprint', 'sprint-id', 'sprint-code',
        'parent', 'parent-id', 'parent-code',
        'status', 'code', 'subject', 'status-code', 'status-from', 'status-till', 'status-period', 'status-isDelayed',
        'status-isDraft', 'status-isFirst', 'status-isPaused', 'status-isFinal', 'status-isCancelled',
        'include-closed', 'include-draft', 'include-discarded', 'isClosed', 'isDraft', 'isDiscarded',
        'workflow', 'workflow-id', 'workflow-code',
        'journal-assignee', 'journal-status', 'journal-isDelayed', 'journal-from', 'journal-till', 'journal-period',
        'entity-id', 'entity-type', 'entity-name',
        'children-exists', 'children-closed',
        'assignee', 'owner', 'type', 'assignee-role-id',
        'meta-isHidden', 'category-id', 'category-code', 'tags', 'endless', 'dependsOn', 'priority', 'exclude', 'include'
      ],
      belongs: i => this.belongs(i)
    });

    // this.api.afterCreate.subscribe((item: Task) => {
    //   if (this.belongs(item)) {
    //     this.add(item);

    //     if (this.oaAfterCreate) {
    //       this.oaAfterCreate(item);
    //     }
    //   }
    // });
  }

  ngOnInit() {
    // this.refresh();
    this.columns = this.columns || ['icon', 'code', 'priority',
      'category', 'size', 'brunt',
      'progress', 'effort', 'order', 'workflow', 'id', 'subject',
      'description', 'tags', 'status', 'actions', 'priorityToggler',
      'assignee', 'planFinish', 'dueDate', 'edit', 'view'];

    this.preInit();

    if (this.parent && this.parent.children) {
      this.items = this.parent.children;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.params) {
    //   if (this.params.status) {
    //     this.selectedStatus = this.params.status
    //   }

    //   if (this.params.type) {
    //     this.type = this.params.type
    //   }
    // }


    let refreshList = true;

    if (changes.view && !changes.view.firstChange) {
      refreshList = false;
    }

    // if (this.paging && !this.paging.limit) {
    //   refreshList = false;
    // }

    if (changes.includeDiscarded || changes.includeDraft || changes.includeClosed || (changes.params && this.params._refresh)) {
      refreshList = true;
    }

    if (refreshList || !this.items.length) {
      this.onRefresh();
    }
  }

  onRefresh() {

    if (this.oaBeforeFetch) {
      this.oaBeforeFetch();
    }

    if (!this.details && this.workflow) {
      if (this.workflow.children && this.workflow.children.length) {
        this.details = 'page';
      } else if (this.workflow.meta && this.workflow.meta.details) {
        this.details = this.workflow.meta.details;
      }
    }
    this.filters.reset(false);

    if (this.params) {
      Object.keys(this.params).forEach((key) => {
        this.filters.set(key, this.params[key]);
      });
    }

    if (this.project) {
      if (this.project.id) {
        this.filters.set('project-id', this.project.id);
      } else if (this.project.code) {
        this.filters.set('project-code', this.project.code);
      }
    }

    if (this.workflow) {
      if (this.workflow.id) {
        this.filters.set('workflow-id', this.workflow.id);
      } else if (this.workflow.code) {
        this.filters.set('workflow-code', this.workflow.code);
      }
    }

    if (this.category) {
      if (this.category.id) {
        this.filters.set('category-id', this.category.id);
      } else if (this.workflow.code) {
        this.filters.set('category-code', this.category.code);
      }
    }

    if (this.release !== undefined) {
      if (this.release === null) {
        this.filters.set('release', null);
        // this.filters.set('release', this.release.id || this.release.code);
      } else {
        this.filters.set('release', this.release.id || this.release.code);
      }
    }

    if (this.sprint) {
      this.filters.set('sprint', this.sprint);
    }

    if (this.exclude) {
      this.filters.set('exclude', this.exclude);
    }

    if (this.include) {
      this.filters.set('include', this.include);
    }

    if (this.parent !== undefined && this.parent !== null) {
      if (this.parent === 'none') {
        this.filters.set('parent', 'none');
      } else {
        this.filters.set('parent', this.parent.id || this.parent.code);
      }
    }

    if (this.endless !== undefined && this.endless !== null) {
      this.filters.set('endless', this.endless);
    }

    if (this.isClosed !== undefined && this.isClosed !== null) {
      this.filters.set('isClosed', this.isClosed);
    }

    if (this.isCancelled !== undefined && this.isCancelled != null) {
      this.filters.set('status-isCancelled', this.isCancelled);
    }

    if (this.isDraft !== undefined && this.isDraft !== null) {
      this.filters.set('isDraft', this.isDraft);
    }

    if (this.isDiscarded !== undefined && this.isDiscarded !== null) {
      this.filters.set('isDiscarded', this.isDiscarded);
    }

    if (this.includeDiscarded !== undefined && this.includeDiscarded !== null) {
      this.filters.set('include-discarded', this.includeDiscarded);
    }

    if (this.includeClosed !== undefined && this.includeClosed !== null) {
      this.filters.set('include-closed', this.includeClosed);
    }

    if (this.includeDraft !== undefined && this.includeDraft !== null) {
      this.filters.set('include-draft', this.includeDraft);
    }

    if (this.type) {
      this.filters.set('type', this.type);
    }

    if (this.dependsOn) {
      if (typeof this.dependsOn === 'string') {
        this.filters.set('dependsOn', { code: this.dependsOn });
      } else {
        this.filters.set('dependsOn', this.dependsOn.code);
      }
    }

    if (this.selectedStatus) {
      if (typeof this.selectedStatus === 'string') {
        this.filters.set('status-code', this.selectedStatus);
      } else {
        this.filters.set('status-code', this.selectedStatus.code);
      }
    }

    if (this.text) {
      this.filters.set('subject', this.text);
    }

    if (this.selectedCode) {
      this.filters.set('code', this.selectedCode);
    }

    if (this.selectedSubject) {
      this.filters.set('subject', this.selectedSubject);
    }

    if (this.entity) {
      this.filters.set('entity-id', this.entity.id);
      this.filters.set('entity-type', this.entity.type);
      this.filters.set('entity-name', this.entity.name);
    }


    if (this.assignee) {
      this.filters.set('assignee', this.assignee);
    }

    if (this.assigneeByRole) {
      this.filters.set('assignee-role-id', this.assigneeByRole);
    }

    if (this.owner) {
      this.filters.set('owner', this.owner);
    }

    if (this.isHidden) {
      this.filters.set('meta-isHidden', this.isHidden);
    }

    if (this.tags) {
      this.filters.set('tags', this.tags);
    }

    this.fetch().subscribe((page) => {
      // eslint-disable-next-line no-console
      this.items = page.items;
      if (this.items && this.items.length && this.items.find((i) => i.tags && i.tags.length > 0)) {
        this.sortData(this.items);
      }

      if (this.oaAfterFetch) {
        this.oaAfterFetch();
      }
    });
  }

  sortData(items) {
    let count = 0;
    items.forEach((item) => {
      item.meta = item.meta || {};
      item.meta.sort = 0;
      if (item.tags && item.tags.length && this.parent && this.parent.currentStatus && item.tags.includes(this.parent.currentStatus.code)) {
        count++;
        item.meta.sort = count;
      }
    });
    items.sort((a, b) => b.meta.sort - a.meta.sort);
    this.items = items;
  }

  updateSubject(task: Task, subject) {

    subject = this.uxService.getTextFromEvent(subject);
    if (!subject) {
      task.isEditing = false;
      return;
    }

    this.api.updateSubject(task, subject).subscribe(() => {
      task.isEditing = false;
    });
  }

  attach(task: Task) {
    if (!this.release && !this.addRelease) {
      return
    }

    const release = this.release || this.addRelease

    this.api.update(task.id, {
      release: {
        id: release.id,
        code: release.code,
        name: release.name,
      }
    }).subscribe((item) => {
      this.refresh.emit(item)
    });
  }

  detach(task: Task) {
    this.api.update(task.id, { release: null }).subscribe((item) => {
      this.refresh.emit(item)
    });
  }

  bulkAttach(tasks: Task[]) {
    if (!this.release && !this.addRelease && (!tasks || !tasks.length)) {
      return
    }

    const release = this.release || this.addRelease
    const model = (tasks.map((t) => {
      return {
        id: t.id,
        code: t.code,
        release: {
          id: release.id,
          code: release.code,
          name: release.name,
        }
      }
    }) as any);

    this.api.bulk(model).subscribe(() => {
      this.refresh.emit()
    })
  }

  bulkDetach(tasks: Task[]) {
    const model = (tasks.map((t) => {
      return {
        id: t.id,
        code: t.code,
        release: null
      }
    }) as any);

    this.api.bulk(model).subscribe(() => {
      this.refresh.emit()
    })
  }

  private belongs(item: Task): boolean {
    if (!item) {
      return false;
    }

    const matches = (filter: any, attribute: any) => {
      if (filter === undefined) { return true; }
      if (filter === null) { return !attribute; }

      if (attribute === undefined) { return false; }

      if (typeof filter === 'string') {
        if (typeof attribute === 'string') {
          return filter === attribute;
        } else {
          return filter === attribute.code;
        }
      } else if (typeof attribute === 'string') {
        return filter.code === attribute;
      }

      if (((filter.id && attribute.id && filter.id === attribute.id) ||
        (filter.code && attribute.code && filter.code === attribute.code))) {
        return true;
      }

      return false;

    };

    if (!matches(this.project, item.project)) {
      return false;
    }

    // if (!matches(this.type, item.type)) {
    //   return false;
    // }

    if (!matches(this.workflow, item.workflow)) {
      return false;
    }

    // if (this.selectedStatus && (!item.status || item.status !== this.selectedStatus)) {
    //   return false;
    // }

    if (!matches(this.selectedStatus, item.status)) {
      return false;
    }

    if (!matches(this.release, item.release)) {
      return false;
    }

    if (!matches(this.sprint, item.sprint)) {
      return false;
    }

    if (!matches(this.parent, item.parent)) {
      return false;
    }

    if (!matches(this.assignee, item.assignee)) {
      return false;
    }

    if (this.dependsOn) {
      return false;
    }

    if (this.entity && (!item.entity || item.entity.id !== this.entity.id || item.entity.type !== this.entity.type)) {
      return false;
    }

    return true;

  }

  updateAssignee(item: Task, assignee: IUser) {
    this.api.updateAssignee(item, assignee).subscribe((task) => {
      // if (this.oaAfterUpdate) {
      //   this.oaAfterUpdate(item);
      // }
      this.taskUpdated.emit(task);
    });
  }

  updateStatus(item: Task, status) {
    this.api.updateStatus(item, status).subscribe((task) => {
      // if (this.oaAfterUpdate) {
      //   this.oaAfterUpdate(item);
      // }
      this.taskUpdated.emit(task);
    });
  }

  updatePriority(item: Task, priority) {
    if (typeof priority === 'string') {
      priority = parseInt(priority, 10);
    }
    this.api.updatePriority(item, priority).subscribe((task) => {
      // if (this.oaAfterUpdate) {
      //   this.oaAfterUpdate(item);
      // }
      this.taskUpdated.emit(task);
    });
  }

  updatePoints(item: Task, points: any) {

    if (typeof points === 'string') {
      points = parseInt(points, 10);
    }

    if (item.points === points) {
      return;
    }

    this.api.updatePoints(item, points).subscribe((task) => {
      // if (this.oaAfterUpdate) {
      //   this.oaAfterUpdate(item);
      // }
      this.taskUpdated.emit(task);
    });
  }

  updateSize(item: Task, effort) {
    let minutes = 0
    switch (effort.unit.code) {
      case 'min':
        minutes = effort.value;
        break;
      case 'hr':
        minutes = effort.value * 60;
        break;
      case 'day':
        minutes = effort.value * 60 * 8;
        break;
    }

    this.api.updateSize(item, minutes).subscribe((task) => {
      // if (this.oaAfterUpdate) {
      //   this.oaAfterUpdate(item);
      // }
      this.taskUpdated.emit(task);
    });
  }

  updateDueDate(item: Task, $event: any) {
    const plan = new TimeLine(item.plan);
    plan.finish = $event;
    this.api.updatePlan(item, plan).subscribe((task) => {
      // if (this.oaAfterUpdate) {
      //   this.oaAfterUpdate(item);
      // }
      this.taskUpdated.emit(task);
    });
  }

  updateSprint(item: Task, sprint: Sprint) {
    this.api.updateSprint(item, sprint).subscribe((task) => {
      // if (this.oaAfterUpdate) {
      //   this.oaAfterUpdate(item);
      // }
      this.taskUpdated.emit(task);
    });
  }

  updateCategory(item: Task, category: Category) {
    if (item.category && item.category.id === category.id) {
      return;
    }

    this.api.updateCategory(item, category).subscribe((task) => {
      // if (this.oaAfterUpdate) {
      //   this.oaAfterUpdate(item);
      // }
      this.taskUpdated.emit(task);
    });
  }
}
