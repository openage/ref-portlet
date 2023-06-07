import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Task } from 'src/app/lib/oa/gateway/models';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Action } from 'src/app/lib/oa/core/structures';
import { State } from 'src/app/lib/oa/gateway/models/state.model';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { ConfirmDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { RejectMsgDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/reject-msg-dialog/reject-msg-dialog.component';
import { TaskListDialogComponent } from '../task-list-dialog/task-list-dialog.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'gateway-task-actions',
  templateUrl: './task-actions.component.html',
  styleUrls: ['./task-actions.component.css']
})

export class TaskActionsComponent implements OnInit, OnChanges {

  @Input()
  task: Task;

  @Input()
  code: string;

  @Input()
  skipAction: boolean = false;

  @Input()
  before: any = {};

  @Input()
  validations: any = {};

  @Input()
  view: string;

  @Input()
  options?: {
    more?: {
      hide?: boolean;
      extras?: Action[]
    }
  } = {};

  @Output()
  updated: EventEmitter<Task> = new EventEmitter();

  @Output()
  clicked: EventEmitter<any> = new EventEmitter();


  actions: Action[] = [];
  menu: Action[] = [];
  primaryAction: Action;
  primaryActionClass: string;
  params: any;

  constructor(
    private taskService: TaskService,
    private uxService: UxService,
    public auth: RoleService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    this.params = this.activatedRoute.snapshot.queryParams || {}
  }

  ngOnInit() {
    // this.extractActions();
  }

  ngOnChanges(): void {
    this.fetch();
  }

  fetch() {
    if (this.code) {
      this.taskService.get(this.code).subscribe((t) => {
        this.task = t;
        this.task.isProcessing = false;
        this.extractActions();
      });
    } else {
      this.extractActions();
    }
  }

  extractActions() {
    this.options = this.options || {};
    this.options.more = this.options.more || {};
    this.options.more.extras = this.options.more.extras || [];
    this.primaryAction = undefined;
    this.actions = [];
    this.menu = [];
    const currentStatus = this.task.currentStatus || this.task.status;

    if (typeof currentStatus === 'string') {
      return;
    }

    const states = (currentStatus as any).next || [];

    states.forEach((item) => {

      if (!this.hasPermission(item.permissions)) { return; }

      const action = new Action({
        code: item.code,
        title: item.action,
        icon: item.icon,
        style: item.style,
        isDisabled: item.isDisabled || item.isAuto,
        isCancelled: item.isCancelled,
        isSkipActionOnList: item.isSkipActionOnList,
        isAuto: item.isAuto,
        event: () => this.onStateSet(item)
      });

      if (!this.primaryAction && item.isCancelled === false) {
        this.primaryAction = action;
        this.primaryActionClass = this.primaryAction.style || 'default';
        if (item.isFinal) {
          this.primaryActionClass = item.isCancelled ? 'warn' : 'success';
        } else if (item.isFirst) {
          if (currentStatus.isDraft) {
            this.primaryActionClass = 'primary';
          }
        }
      } else {
        this.menu.push(action);
      }
      this.actions.push(action);
    });

    this.options.more.extras.forEach((item) => {
      if (!item.permissions || this.hasPermission(item.permissions)) {
        this.actions.push(item);
        this.menu.push(item);
      }
    });

    this.checkAutoTrigger();
  }

  checkAutoTrigger() {
    if (this.params && this.params['trigger']) {
      if (!this.view) {
        for (const action of this.actions) {
          if (action.isAuto && (action.code === this.params['trigger']) &&
            !(this.skipAction && action.isSkipActionOnList)) {
            action.event(this.task)
            return
          }
        }
      } else if (this.view === 'action') {
        if (this.primaryAction && this.primaryAction.isAuto &&
          (this.primaryAction.code === this.params['trigger']) &&
          !(this.skipAction && this.primaryAction.isSkipActionOnList)) {
          this.primaryAction.event(this.task)
          return
        }

        if (!this.options.more.hide && this.menu && this.menu.length && this.checkSkipAction()) {
          for (const action of this.menu) {
            if (action.isAuto && (action.code === this.params['trigger']) &&
              !(this.skipAction && action.isSkipActionOnList)) {
              action.event(this.task)
              return
            }
          }
        }

      }
    }
  }

  hasPermission(permissions: string[] = []) {
    let items;
    if (this.task.assignee && this.task.assignee.email) {
      items = [`email:${this.task.assignee.email}`, ...permissions];
    }
    return this.auth.hasPermission(items);
  }

  checkSkipAction() {
    if (this.skipAction) {
      let arr = this.menu.filter(item => !item.isSkipActionOnList) || []
      if (arr.length) {
        return true
      }
      return false
    } else {
      return true
    }
  }

  onStateSet(state: State) {
    this.clicked.emit(state);
    this.task.isProcessing = true;
    const functions = this.getBefore(state);

    // if (!functions || !functions.length) {
    //   return this.setStatus(state);
    // }

    this.execute(0, functions, state.code);

    // if (typeof value === 'boolean') {
    //   if (value) {
    //     this.setStatus(state);
    //   }
    //   return;
    // }

    // value.subscribe((v) => {
    //   if (v) {
    //     this.setStatus(state);
    //   }
    // });
  }

  execute(index, functions, stateCode) {
    if ((functions.length - 1) < index) {
      return false;
    }
    const value = functions[index](this.task, stateCode);

    if (typeof value === 'boolean') {
      if (!value) {
        this.task.isProcessing = false;
        return false;
      }

      return this.execute(index + 1, functions, stateCode);
    }

    const subject = new Subject<boolean>();

    value.subscribe((v) => {
      if (!v) {
        return subject.next(false);
      }
      return subject.next(this.execute(index + 1, functions, stateCode));
    });

    return subject.asObservable();
  }

  setStatus(state: State) {
    this.taskService.updateStatus(this.task, state).subscribe((i) => {
      this.task = i;
      this.extractActions();
      this.updated.emit(this.task);
      this.task.isProcessing = false;
    }, (err) => { this.task.isProcessing = false; });
  }

  getBefore(state: State) {
    const actions = [];
    const functions = [];

    if (this.before && this.before[state.code]) {
      functions.push(this.before[state.code]);
    }

    if (state.before) {
      functions.push(state.before);
    }

    (state.hooks || [])
      .filter((h) => h.trigger.when === 'before')
      .map((i) => i.actions)
      .forEach((i) => {
        actions.push(...i.filter((a) => a.handler === 'frontend'));
      });

    actions.forEach((a) => {
      switch (a.type) {
        case 'input':
          functions.push(() => {
            return this.userInput(a.config);
          });
          break;
        case 'confirmation':
          functions.push(() => {
            return this.confirmation(a.config);
          });
          break;
        case 'validation':
        case 'navigate':
          this.getValidations(a.config).forEach((item) => {
            functions.push(item);
          });
          break;
        case 'list':
          functions.push(() => {
            return this.listItems(a.config);
          });
          break;
        case 'back-stage':
          functions.push(() => {
            return this.backStage(a.config);
          });
          break;
        case 'action-items-save':
          if (this.before['action-items-save']) {
            functions.push(this.before['action-items-save']);
          }
          break;
      }
    });

    functions.push(() => {
      this.setStatus(state);
      return true;
    });

    return functions;
  }

  userInput(config: any): Observable<boolean> {
    const subject = new Subject<boolean>();
    const dialogRef = this.dialog.open(RejectMsgDialogComponent, {
      width: '400px',
    });

    dialogRef.componentInstance.config = config;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const model: any = {};
        model.meta = {};
        model.meta[config.field] = result;
        model['message'] = result.message;
        this.taskService.update(this.task.id, model).subscribe(
          () => subject.next(true),
          () => subject.next(false)
        );
      } else {
        subject.next(false);
      }
      this.task.isProcessing = false;
    });
    return subject.asObservable();
  }

  confirmation(config: any): Observable<boolean> {
    const subject = new Subject<boolean>();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
    });

    dialogRef.componentInstance.title = config.title;
    dialogRef.componentInstance.message = config.message;
    dialogRef.componentInstance.confirmTitle = config.confirmTitle;
    dialogRef.componentInstance.cancelTitle = config.cancelTitle;
    dialogRef.componentInstance.options = config.options;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        subject.next(true);
      } else {
        subject.next(false);
      }
      this.task.isProcessing = false;
    });

    return subject.asObservable();
  }

  getValidations(config: any) {
    const items = [];
    for (const item of config.items) {
      const validationItem = this.validations[item.code];
      if (validationItem) {

        items.push(() => {
          let result = validationItem(item);

          if (Array.isArray(result)) {
            this.uxService.showError(result, { title: item.title || 'Check Your Submission!' });
            result = false;
            return result;
          } else if (typeof result === 'boolean') {
            if (!result) {
              this.uxService.showError(item.message);
            }
            return result;
          }

          const subject = new Subject<boolean>();

          result.subscribe((v) => {
            if (!v) {
              this.uxService.showError(item.message);
            }
            return subject.next(v);
          });

          return subject.asObservable();
        });
      }
    }
    return items;
  }

  listItems(config: any): Observable<boolean> {
    const subject = new Subject<boolean>();
    const dialogRef = this.dialog.open(TaskListDialogComponent, {
      width: '1100px',
    });

    dialogRef.componentInstance.config = config;
    dialogRef.componentInstance.parent = this.task;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        subject.next(true);
        // const model: any = {};
        // model['status'] = config.option.status;
        // this.taskService.update(this.task.id, model).subscribe(
        //   () => subject.next(true),
        //   () => subject.next(false)
        // );
      } else {
        subject.next(false);
      }
      this.task.isProcessing = false;
    });
    return subject.asObservable();
  }
  backStage(config: any): Observable<boolean> {
    const subject = new Subject<boolean>();
    /*
    const dialogRef = this.dialog.open(TaskBackStageDialogComponent, {
      width: '400px',
    });

    dialogRef.componentInstance.config = config;
    dialogRef.componentInstance.currentStatus = this.task.currentStatus;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const model: any = {};
        model.meta = {};
        model.meta[config.field] = result;
        model['status'] = result.currentStatus;
        this.taskService.update(this.task.id, model).subscribe(
          () => subject.next(true),
          () => subject.next(false)
        );
      } else {
        subject.next(false);
      }
      this.task.isProcessing = false;
    });
    */
    return subject.asObservable();
  }
}
