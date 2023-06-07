import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { Entity, Pic } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Task } from 'src/app/lib/oa/gateway/models';
import { State } from 'src/app/lib/oa/gateway/models/state.model';
import { TimeLine } from 'src/app/lib/oa/gateway/models/timeline.model';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { LocalStorageService } from 'src/app/lib/oa/core/services/local-storage.service';

@Component({
  selector: 'gateway-task-status-bar',
  templateUrl: './task-status-bar.component.html',
  styleUrls: ['./task-status-bar.component.css']
})
export class TaskStatusBarComponent implements OnInit {

  @Input()
  task: Task;

  @Input()
  code: string;

  @Input()
  skipAction: boolean = false;

  @Input()
  hiddenFields: any[] = [];

  @Input()
  detailview = true;

  @Input()
  readonly: boolean;

  @Input()
  customer: any;

  @Input()
  tags: {
    pic?: Pic,
    label?: string
  }[] = [];

  @Input()
  arrow: string;

  @Input()
  entity: Entity;

  @Input()
  minDate: Date;

  @Input()
  before: any = {};

  @Input()
  options: {
    identifier?: { title?: string },
    owner?: { title?: string },
    assignee?: { title?: string },
    hide?: {
      identifier?: boolean,
      owner?: boolean,
      dueDate?: boolean,
      status?: boolean,
      members?: boolean,
      actionArrow?: boolean,
      statusAction?: boolean,
      actionView?: string,
      isActionArrowHidden?: boolean
    },
    fields?: any[],
    more?: any[]
  } = {
      hide: {
        identifier: false,
        owner: false,
        dueDate: true,
        status: false,
        members: true,
        actionArrow: false,
        statusAction: false,
        actionView: '',
        isActionArrowHidden: false
      },
      fields: [],
      more: []
    };

  @Input()
  validations: any = {};

  @Input()
  view: {
    slides?: boolean,
    children?: boolean,
    members?: boolean
  } = {
      slides: true,
      children: false,
      members: false
    };

  @Input()
  permissions: {
    assign?: string[],
    owner?: string[]
  } = {};

  effortUnits = 'Point(s)';

  @Output()
  change: EventEmitter<{
    slides?: boolean,
    children?: boolean,
    members?: boolean
  }> = new EventEmitter();

  @Output()
  details: EventEmitter<any> = new EventEmitter();

  @Output()
  onSelect: EventEmitter<any> = new EventEmitter();

  @Output()
  onUpdate: EventEmitter<any> = new EventEmitter();

  @Output()
  onDateChange: EventEmitter<any> = new EventEmitter();

  @Output()
  fetched: EventEmitter<Task> = new EventEmitter();

  @Output()
  actionClicked: EventEmitter<any> = new EventEmitter();

  @Output()
  onClickMore: EventEmitter<{
    type: string,
    task: Task
  }> = new EventEmitter();

  isProcessing = false;
  isSelected = false;
  from: string;
  isOwner = false;
  currentDate = new Date();
  priorities: any[] = [];

  constructor(
    private service: TaskService,
    private navService: NavService,
    public auth: RoleService,
    private cache: LocalStorageService,
    private taskService: TaskService,
  ) {
    this.priorities = taskService.priorities;
    service.afterUpdate.subscribe((t) => {
      if (this.task && this.task.id !== t.id) {
        return;
      }

      const uiState = this.task.getUIState();
      this.task = t;
      this.task.setUIState(uiState);
      this.calculate();
    });
  }

  ngOnInit() {
    this.options = this.options || {};
    this.options.hide = this.options.hide || {};
    if (this.code && !(this.task && this.task.code)) {
      this.taskService.get(this.code).subscribe(task => {
        this.task = task;
        this.fetched.emit(task);
      })
    }

    const isSet = this.cache.components('gateway|task-status-bar').get('detailview');

    if (isSet === null || isSet === undefined) {
      this.cache.components('gateway|task-status-bar').set('detailview', this.detailview);
    } else {
      this.detailview = !!this.cache.components('gateway|task-status-bar').get('detailview');
    }

    this.details.emit(this.detailview);

  }

  ngOnChanges() {
    if (this.task && this.task.owner && (this.task.owner.email === this.auth.currentUser().email)) {
      this.isOwner = true;
    }
  }

  onPriorityChange($event, item) {
    item.priority = $event;
    const data = { priority: item.priority };
    this.save(item, data);
  }

  onAssigneeSelect() {
    this.isSelected = !this.isSelected;
    this.from = 'assignee';
  }

  onDateSelect() {
    this.isSelected = !this.isSelected;
    this.from = 'dueDate';
  }

  onOptionMore(code: string, task: Task) {
    this.onClickMore.emit({
      type: code,
      task
    });
  }

  save(item, data, options?: any) {
    this.isProcessing = true;
    this.service.update(item.id, data).subscribe((i) => {
      this.onDateChange.emit(i);
      if (options && options.from === 'assignee') {
        this.onUpdate.emit(i);
      }
      this.isProcessing = false;
    });
  }

  onClose() {
    this.isSelected = !this.isSelected;
  }

  onChange($event, item: Task, from) {
    this.isSelected = false;
    let data;
    if (from === 'dueDate') {
      item.plan.finish = $event;
      data = { plan: { finish: item.plan.finish } };
    }
    if (from === 'assignee') {
      item.assignee = $event;
      data = { assignee: item.assignee };
    }
    if (from === 'owner') {
      item.owner = $event;
      data = { owner: item.owner };
    }
    this.save(item, data, { from });
  }

  onAssigneeSet($event, item: Task) {

    this.service.updateAssignee(item, $event).subscribe((i) => {
      this.onUpdate.emit(i);
      this.isProcessing = false;
    });
  }

  onOwnerSet($event, item: Task) {

    this.service.updateOwner(item, $event).subscribe((i) => {
      this.onUpdate.emit(i);
      this.isProcessing = false;
    });
  }

  onToggle() {
    this.detailview = !this.detailview;
    this.cache.components('gateway|task-status-bar').set('detailview', this.detailview);
    this.details.emit(this.detailview);
  }

  goto() {
    if (this.entity) {
      this.navService.goto(new Entity(this.entity));
    } else {
      this.onSelect.emit(this.task);
    }
  }

  calculate() {
    this.task.burnt = this.task.burnt || 0;
    this.task.size = this.task.size || 0;
  }

  getSizeStyle() {
    const percentage = (100 * (this.task.burnt) / (this.task.size || 1));

    return {
      background: percentage ? '' : `linear-gradient(90deg, var(--default) ${percentage}%, transparent ${100 - percentage}%)`
    };
  }

  updateStatus(item: State) {
    this.service.updateStatus(this.task, item);
  }

  toggleShowSlides() {
    this.view.slides = !this.view.slides;
    this.change.emit(this.view);
  }

  toggleShowTasks() {
    this.view.children = !this.view.children;
    this.change.emit(this.view);
  }

  setPlan($event: TimeLine) {
    this.service.updatePlan(this.task, $event);
  }

  afterTaskUpdate(task) {
    this.task = task;
    this.onUpdate.emit(this.task);
  }

  onActionClicked(event) {
    this.actionClicked.emit(event);
  }
}
