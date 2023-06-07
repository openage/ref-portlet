import { Directive, ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { IUser } from '../../core/models';
import { Project, Release, Sprint, Task, TimeLog } from '../models';
import { TimeLogService } from '../services';

@Directive()
export class TimeLogListBaseComponent extends PagerModel<TimeLog> implements OnInit, OnChanges {

  @Input()
  project: any;

  @Input()
  task: Task;

  @Input()
  user: string | IUser;

  @Input()
  roleId: string;

  @Input()
  release: Release;

  @Input()
  sprint: Sprint;

  @Input()
  activity: string;

  @Input()
  date: Date = null;

  @Input()
  from: Date;

  @Input()
  to: Date;

  // @Input()
  // sorting: string;

  @Input()
  view: 'table' | 'list' | 'grid' | 'standUp' | 'calendar' = 'table';

  @Input()
  columns: any[] = ['index', 'details', 'user', 'effort', 'date'];

  @Output()
  taskSelected: EventEmitter<Task> = new EventEmitter()

  afterProcessing: () => void;

  constructor(
    api: TimeLogService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      pageOptions: {
        limit: 10
      },
      filters: ['project-id', 'project-code', 'release-id', 'sprint-id',
        'task-id', 'user-role-id', 'status', 'activity', 'user', 'date', 'from', 'to', 'sort'],
      belongs: i => this.belongs(i)
    });

    // api.afterCreate.subscribe((item: TimeLog) => {
    //   if (this.belongs(item)) {
    //     this.add(item);
    //   }
    // });
  }

  ngOnInit(): void {
    // this.refresh();
  }

  ngOnChanges(): void {
    this.refresh();
  }

  refresh() {
    this.filters.reset(false);

    if (this.task) {
      this.filters.set('task-id', this.task.id);
    }

    if (this.project) {
      if (this.project.id) {
        this.filters.set('project-id', this.project.id);
      } else if (this.project.code) {
        this.filters.set('project-code', this.project.code);
      }
    }

    if (this.release) {
      this.filters.set('release-id', this.release.id);
    }

    if (this.sprint) {
      this.filters.set('sprint-id', this.sprint.id);
    }

    if (this.activity) {
      this.filters.set('activity', this.activity);
    }

    if (this.user) {
      this.filters.set('user', this.user);
    }

    if (this.date) {
      this.filters.set('date', this.date);
    }

    if (this.from) {
      this.filters.set('from', this.from);
    }

    if (this.to) {
      this.filters.set('to', this.to);
    }

    if (this.paging?.sort) {
      this.filters.set('sort', this.paging?.sort);
    }

    if (this.roleId) {
      this.filters.set('user-role-id', this.roleId);
    }

    this.fetch().subscribe(() => { });
  }

  private belongs(item: TimeLog): boolean {
    if (!item) {
      return false;
    }

    const matches = (filter: any, attribute: any) => {
      if (filter === undefined) { return true; }
      if (attribute === undefined) { return false; }

      if (filter === null) { return attribute === null; }

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

    if (!matches(this.release, item.release)) {
      return false;
    }

    if (!matches(this.sprint, item.sprint)) {
      return false;
    }

    if (!matches(this.task, item.task)) {
      return false;
    }

    if (!matches(this.user, item.user)) {
      return false;
    }

    return true;
  }

}
