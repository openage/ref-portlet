import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Entity, IUser } from 'src/app/lib/oa/core/models';
import { Task } from 'src/app/lib/oa/gateway/models';
import { State } from 'src/app/lib/oa/gateway/models/state.model';
import { DateService } from 'src/app/lib/oa/core/services/date.service';
import { Workflow } from 'src/app/lib/oa/gateway/models/workflow.model';
import { TaskService } from 'src/app/lib/oa/gateway/services/task.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'gateway-task-states',
  templateUrl: './task-states.component.html',
  styleUrls: ['./task-states.component.css']
})
export class TaskStatesComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  code: string;

  @Input()
  task: Task | any;

  @Input()
  entity: Entity | any;

  @Input()
  workflow: Workflow | string;

  @Input()
  options: {
    create?: {
      meta: any,
      template: string,
      status: any,
      parent: any,
      owner: any,
      project: string,
      members: any,
      organization: any,
      actual: any,
      plan: any
    }
  };

  @Input()
  view = 'stepper';

  @Input()
  items: {
    code: string,
    name: string,
    timeStamp?: Date,
    finishDate?: Date,
    consumed?: number,
    isOverdue?: boolean,
    estimate?: number,
    eta?: Date,
    isCurrent?: boolean,
    isFinal?: boolean,
    user?: IUser,
    style?: string,
    isSelected?: boolean,
    date?: Date
  }[] = [];

  @Output()
  fetched: EventEmitter<Task> = new EventEmitter();

  states: State[];
  journals: {
    user: IUser,
    timeStamp: Date,
    state: State
  }[];

  comments: any;

  constructor(
    private taskApi: TaskService,
    private dateService: DateService
  ) {
    taskApi.afterUpdate.subscribe((t) => {
      if (this.task && t && t.id === this.task.id) {
        this.task = t;
        this.setTask();
      }
    });
  }

  ngOnInit() {
    // this.fetch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.code || changes.code.previousValue !== this.code) {
      // this.task = undefined;
      this.fetch();
    }
  }

  ngOnDestroy(): void {
    this.task = undefined;
  }

  fetch() {
    if (this.task) {
      this.setTask();
    } else if (this.code) {
      this.taskApi.get(this.code).subscribe((task) => {
        this.task = task;
        this.fetched.next(this.task);
        this.setTask();
      });
    } else if (this.entity && this.workflow) {
      this.taskApi.getByEntity(this.entity, this.workflow, (this.options && this.options.create ? this.options.create : undefined)).subscribe((task) => {
        this.task = task;
        this.fetched.next(this.task);
        this.setTask();
      });
    }
  }

  setTask() {
    let journalsArray = [];
    this.items = [];
    this.states = this.task.workflow.states;

    journalsArray = (this.task.journals || []).map((j) => {
      return {
        code: j.state.code,
        name: j.state.name,
        timeStamp: j.timeStamp,
        estimate: j.state.estimate,
        date: j.state.date,
        eta: j.state.dueDate,
        user: j.user
      };
    });
    if (journalsArray && journalsArray.length) {
      this.states.forEach((item) => {
        journalsArray.forEach((journalItem) => {
          if (journalItem.code === item.code) {
            journalItem.style = item.style || 'default';
            if (this.items.find((i) => i.code === journalItem.code)) {
              const itemIndex = this.items.findIndex((i) => i.code === journalItem.code);
              this.items[itemIndex] = journalItem;
            } else {
              this.items.push(journalItem);
            }
          }
        });
      });
    }

    let current: string;
    if (this.items && this.items.length) {

      if (this.task.currentStatus) {
        const item = this.items.find((i) => i.code === this.task.currentStatus.code);
        item.isCurrent = true;
        current = item.code;
      } else {
        const item = this.items.find((i) => i.code === (this.task.status as any).code);
        item.isCurrent = true;
        current = item.code;
      }
    }
    this.setNext(current);

    let isFinished = true;

    for (let index = 0; index < this.items.length; index++) {
      const item = this.items[index];

      const state = this.states.find((s) => s.code === item.code);

      item.estimate = state.estimate * 60;
      item.isOverdue = false;

      if (isFinished) {
        item.finishDate = item.timeStamp;
        item.consumed = this.dateService.time(item.date).diff(item.finishDate);
        item.isOverdue = item.estimate > 0 && item.estimate && item.estimate < item.consumed;
      }

      if (item.code === current) {
        isFinished = false;
      }

      // if (item.date) {
      //   const next = this.items[index + 1];

      //   if (next && next.date) { // is complete
      //     item.consumed = this.dateService.time(next.date).diff(item.date);
      //     item.finishDate = next.date;
      //   } else { // is current
      //     item.consumed = this.dateService.time(new Date()).diff(item.date);
      //     item.eta = item.estimate > 0 ? this.dateService.date(item.date).add(item.estimate, 's') : new Date();
      //     if (this.dateService.time(item.eta).gt(new Date())) {
      //       item.eta = new Date();
      //     }
      //   }
      //   item.isOverdue = item.estimate > 0 && item.estimate && item.estimate < item.consumed;
      // } else { // is next
      //   let previousEta = new Date();

      //   if (index > 0) {
      //     previousEta = this.items[index - 1].eta;
      //   }

      //   item.eta = item.estimate > 0 ? this.dateService.date(previousEta).add(item.estimate, 's') : new Date();
      // }

    }
    this.fetched.next(this.task);
  }

  setNext(code: string) {
    if (!code) {
      const first = this.states.find((s) => s.isFirst);
      if (first) {
        this.items.push({
          code: first.code,
          name: first.name,
          estimate: first.estimate,
          style: first.style
        });
        return this.setNext(first.code);
      }
      return;
    }

    const state = this.states.find((s) => s.code === code);

    if (!state || !state.next || !state.next.length) { return; }

    const next = state.next[0];

    if (next.isCancelled) { return; }

    if (!this.items.find((i) => i.code === next.code)) {
      this.items.push({
        code: next.code,
        name: next.name,
        isFinal: next.isFinal,
        style: next.style
      });
    }

    if (next.isFinal) { return; }

    this.setNext(next.code);

  }

}
