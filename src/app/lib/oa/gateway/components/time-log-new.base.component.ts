import { Directive } from '@angular/core';
import { ErrorHandler, Input, OnInit } from '@angular/core';
import { Entity, IUser } from '../../core/models';
import { DetailBase } from '../../core/structures';
import { Project, Release, Sprint, Task, TimeLog, User } from '../models';
import { TimeLogService } from '../services';

@Directive()
export class TimeLogNewBaseComponent extends DetailBase<TimeLog> implements OnInit {

  @Input()
  readonly: boolean = false;

  @Input()
  entity: Entity;

  @Input()
  project: Project;

  @Input()
  sprint: Sprint;

  @Input()
  task: Task;

  @Input()
  release: Release;

  @Input()
  user: IUser;

  timeLog: TimeLog = new TimeLog({});

  isProcessing: boolean;

  activities = ['analysis', 'discussion', 'doing', 'reviewing'];

  constructor(
    api: TimeLogService,
    public errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {
    this.preInit();
  }

  onDurationChanged($event) {
    switch ($event.unit.code) {
      case 'min':
        this.timeLog.minutes = $event.value;
        break;
      case 'hr':
        this.timeLog.minutes = $event.value * 60;
        break;
      case 'day':
        this.timeLog.minutes = $event.value * 60 * 8;
        break;
    }
  }

  addNewTimeLog() {
    if (this.task) {
      this.timeLog.task = new Task({ id: this.task.id });
    }

    if (this.project) {
      this.timeLog.project = new Project({ code: this.project.code });
    }

    if (this.release) {
      this.timeLog.release = new Release({ id: this.release.id });
    }

    if (this.sprint) {
      this.timeLog.sprint = new Sprint({ id: this.sprint.id });
    }

    if (this.task && this.task.sprint && !this.sprint) {
      this.timeLog.sprint = new Sprint({ id: this.task.sprint.id });
    }

    return this.create(this.timeLog).subscribe(() => {
      this.errorHandler.handleError('TimeLog added successfully');
      this.timeLog = new TimeLog({})
    });
  }

  onReset() {
    this.timeLog = new TimeLog({});
  }

  onSetTask(task: Task) {
    this.task = new Task(task)
  }

  onSelectDate($event) {
    this.timeLog.date = $event
  }

  onUserSelect($event) {
    this.timeLog.user = $event;
  }

}
