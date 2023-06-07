import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Action } from 'src/app/lib/oa/core/structures';
import { Release, State, Task } from 'src/app/lib/oa/gateway/models';
import { ReleaseService, TaskService } from 'src/app/lib/oa/gateway/services';
import { ConfirmDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { RejectMsgDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/reject-msg-dialog/reject-msg-dialog.component';
import { TaskListDialogComponent } from '../task-list-dialog/task-list-dialog.component';

@Component({
  selector: 'gateway-release-actions',
  templateUrl: './release-actions.component.html',
  styleUrls: ['./release-actions.component.css']
})
export class ReleaseActionsComponent implements OnInit {

  @Input()
  release: Release;

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
  updated: EventEmitter<Release> = new EventEmitter();

  @Output()
  clicked: EventEmitter<any> = new EventEmitter();


  actions: Action[] = [];
  menu: Action[] = [];
  primaryAction: Action;
  primaryActionClass: string;
  params: any;

  constructor(
    private releaseService: ReleaseService,
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
      this.releaseService.get(this.code).subscribe((t) => {
        this.release = t;
        this.release.isProcessing = false;
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
    const currentStatus = this.release.currentStatus || this.release.status;

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
            action.event(this.release)
            return
          }
        }
      } else if (this.view === 'action') {
        if (this.primaryAction && this.primaryAction.isAuto &&
          (this.primaryAction.code === this.params['trigger']) &&
          !(this.skipAction && this.primaryAction.isSkipActionOnList)) {
          this.primaryAction.event(this.release)
          return
        }

        if (!this.options.more.hide && this.menu && this.menu.length && this.checkSkipAction()) {
          for (const action of this.menu) {
            if (action.isAuto && (action.code === this.params['trigger']) &&
              !(this.skipAction && action.isSkipActionOnList)) {
              action.event(this.release)
              return
            }
          }
        }

      }
    }
  }

  hasPermission(permissions: string[] = []) {
    // let items;
    // if (this.release.assignee && this.release.assignee.email) {
    //   items = [`email:${this.release.assignee.email}`, ...permissions];
    // }
    // return this.auth.hasPermission(items);
    return true;

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
    this.clicked.emit(this.release);
    this.release.isProcessing = true;
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
    const value = functions[index](this.release, stateCode);

    if (typeof value === 'boolean') {
      if (!value) {
        this.release.isProcessing = false;
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
    this.releaseService.updateStatus(this.release, state).subscribe((i) => {
      this.release = i;
      this.extractActions();
      this.updated.emit(this.release);
      this.release.isProcessing = false;
    }, (err) => { this.release.isProcessing = false; });
  }

  getBefore(state: State) {
    const actions = [];
    const functions = [];

    const before = this.before[state.code] || state.before;
    if (before) {
      functions.push(before);
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
          this.getValidations(a.config).forEach((item) => {
            functions.push(item);
          });
          break;
        case 'list':
          // functions.push(() => {
          //   return this.listItems(a.config);
          // });
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
        this.releaseService.update(this.release.id, model).subscribe(
          () => subject.next(true),
          () => subject.next(false)
        );
      } else {
        subject.next(false);
      }
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

  // listItems(config: any): Observable<boolean> {
  //   const subject = new Subject<boolean>();
  //   const dialogRef = this.dialog.open(TaskListDialogComponent, {
  //     width: '1100px',
  //   });

  //   dialogRef.componentInstance.config = config;
  //   dialogRef.componentInstance.parent = this.release;

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       subject.next(true);
  //       // const model: any = {};
  //       // model['status'] = config.option.status;
  //       // this.taskService.update(this.task.id, model).subscribe(
  //       //   () => subject.next(true),
  //       //   () => subject.next(false)
  //       // );
  //     } else {
  //       subject.next(false);
  //     }
  //   });
  //   return subject.asObservable();
  // }
}
