import { Component, Input, TemplateRef } from '@angular/core';
import * as moment from 'moment';
import { TaskListBaseComponent } from 'src/app/lib/oa/gateway/components/task-list.base.component';
import { Task } from 'src/app/lib/oa/gateway/models/task.model';
import { Sprint, State } from 'src/app/lib/oa/gateway/models';
import { ReleaseService, TaskService } from 'src/app/lib/oa/gateway/services';
import { UxService } from 'src/app/core/services/ux.service';
import { DateService } from 'src/app/lib/oa/core/services/date.service';
import { SprintDetailComponent } from '../sprint-detail/sprint-detail.component';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'gateway-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent extends TaskListBaseComponent {
  @Input()
  view: string;

  @Input()
  groupBy: string;

  @Input()
  showGoto = true;

  @Input()
  footer = 'default';

  @Input()
  detailsTemplate: TemplateRef<any>;

  @Input()
  showCheckBox: boolean = true;

  @Input()
  bulkAttachBtn: boolean = false;

  @Input()
  bulkDetachBtn: boolean = false;

  groups: {
    label: string,
    nodata?: string,
    items: Task[]
  }[] = [];

  panelOpenState: string;

  readyForDrop = false;

  newSelected = false;

  date: Date;
  from: string;
  selectedIndex: number;
  selectedItem: Task;

  notStartedItems = [];
  wipItems = [];
  completedItems = [];
  rejectedItems = [];
  resolvedItems = [];
  reworkItems = [];

  notStartedZone = false;
  wipZone = false;
  completedZone = false;
  rejectedZone = false;
  resolvedZone = false;
  reworkZone = false;

  points: any[] = [];
  priorities: any[] = [];
  sprints: Sprint[] = [];
  // selectedSprint = 'details';
  // selectedSprintIndex: number = 0;


  constructor(
    private taskService: TaskService,
    uxService: UxService,
    private releaseService: ReleaseService,
    public dateService: DateService,
    private clipboardService: Clipboard
  ) {
    super(taskService, uxService, uxService, dateService);
    this.points = taskService.points;
    this.priorities = taskService.priorities;

    const render = () => {
      switch (this.groupBy) {
        case 'status':
          this.groupByStatus();
          break;
        case 'due-date':
          this.groupByDueDate();
          break;
      }
    };

    this.oaAfterFetch = render;
    this.oaAfterUpdate = render;
    this.oaAfterCreate = render;

    this.oaBeforeFetch = () => {
      // switch (this.view) {
      //   case 'sprint':
      //     this.prepareSprintView();
      //     break;
      // }
    };
  }

  prepareSprintView() {
    this.sprints = this.project.sprints || [];
    let backlog = this.sprints.find((s) => s.code === 'backlog');

    if (!backlog) {
      backlog = new Sprint({ code: 'backlog', name: 'Backlog' });
      this.sprints.push(backlog);
    }

    this.sprint = this.sprints.filter((s) => s.isSelected);

    if (!this.sprint || !this.sprint.length) {
      this.sprint = this.sprints.find((s) => s.status === 'active') ||
        this.sprints.find((s) => s.status === 'new') ||
        this.sprints.find((s) => s.id === 'backlog');
      this.sprint.isSelected = true;
    }
  }

  groupByDueDate() {
    const overdue = [];
    const today = [];
    const next = [];
    const future = [];

    this.items.forEach((task) => {
      if (task?.plan?.finish && this.dateService.date().isSame(task.plan.finish)) {
        today.push(task);
      } else if (task?.plan?.finish && this.dateService.date(task.plan.finish).isPast()) {
        overdue.push(task);
      } else if (task?.plan?.finish && this.dateService.date().isNextSevenDays(task.plan.finish)) {
        next.push(task);
      } else {
        future.push(task);
      }
    });

    this.groups = [];

    if (overdue.length) {
      this.groups.push({
        label: 'Overdue',
        items: overdue
      })
    }

    if (today.length || !overdue.length) {
      this.groups.push({
        label: 'Today',
        nodata: 'TASKS_DONE',
        items: today
      })
    }

    if (next.length || !future.length) {
      this.groups.push({
        label: 'Next',
        nodata: 'TASKS_ADD',
        items: next
      })
    }

    if (future.length) {
      this.groups.push({
        label: 'Upcoming',
        items: future
      })
    }

    this.groups.forEach(p => p.items = p.items.sort((a, b) => a.priority < b.priority ? -1 : 1))
  }

  groupByStatus() {

    const wip = [];
    const todo = [];
    const done = [];

    this.items.forEach((task) => {
      let status = task.currentStatus

      if (status.isFinal || (status.isPaused && !status.isCancelled)) {
        done.push(task)
      } else if (status.isFirst || status.isDraft || status.isPaused || status.isCancelled) {
        todo.push(task)
      } else {
        wip.push(task)
      }
    });

    this.groups = [];

    this.groups.push({
      label: 'To Do',
      nodata: 'TASKS_ADD',
      items: todo
    })

    this.groups.push({
      label: 'In Progress',
      nodata: todo.length ? 'TASKS_PLAN' : 'TASKS_DONE',
      items: wip
    })

    this.groups.push({
      label: 'Done',
      nodata: 'TASKS_PLAN',
      items: done
    })

    this.groups.forEach(p => p.items = p.items.sort((a, b) => a.priority < b.priority ? -1 : 1))


    // this.wipItems = this.items.filter((i) => this.getKanbanListName(i.currentStatus) === 'wip');

    // this.reworkItems = this.items.filter((i) => this.getKanbanListName(i.currentStatus) === 'rework');
    // this.notStartedItems = this.items.filter((i) => this.getKanbanListName(i.currentStatus) === 'not-started');


    // this.resolvedItems = this.items.filter((i) => this.getKanbanListName(i.currentStatus) === 'resolved');
    // this.completedItems = this.items.filter((i) => this.getKanbanListName(i.currentStatus) === 'completed');
    // this.rejectedItems = this.items.filter((i) => this.getKanbanListName(i.currentStatus) === 'rejected');

  }

  copyText(group) {
    const values = [{
      key: "code",
      prefix: "",
      sufix: ":"
    }, {
      key: "status",
      prefix: "(",
      sufix: ")"
    }, {
      key: "subject",
      prefix: "",
      sufix: ""
    }];

    this.clipboardService.copy(this.addToClipBoard(values, group.items))
    this.uxService.showInfo('Copied');
  }

  addToClipBoard(clipboard, items) {
    let str = ''
    items.forEach((item, i) => {
      let sub = ''
      clipboard.forEach((c) => {
        sub = `${sub} ${c.prefix}${item[c.key]}${c.sufix}`
      })

      str = `${str} ${i + 1}. ${sub}\n`
    })
    return str
  }

  getKanbanListName(status: State) {
    if (status.isFirst || status.isDraft) {
      return 'not-started';
    } else if (status.isPaused && status.isCancelled) {
      return 'rework';
    } else if (status.isPaused && !status.isCancelled) {
      return 'resolved';
    } else if (status.isFinal && !status.isCancelled) {
      return 'completed';
    } else if (status.isFinal && status.isCancelled) {
      return 'rejected';
    } else if (!(status.isFirst || status.isDraft || status.isFinal) && status.code !== 'resolved') {
      return 'wip';
    }

    return '';
  }

  getKanbanList(task: Task): any[] {

    const status = task.currentStatus;

    if (status.isFirst || status.isDraft) {
      return this.notStartedItems;
    } else if (!(status.isFirst || status.isDraft || status.isFinal)) {
      return this.wipItems;
    } else if (status.isPaused && status.isCancelled) {
      return this.reworkItems;
    } else if (status.isPaused && !status.isCancelled) {
      return this.resolvedItems;
    } else if (status.isFinal && !status.isCancelled) {
      return this.completedItems;
    } else if (status.isFinal && status.isCancelled) {
      return this.rejectedItems;
    }

    return [];
  }

  resetZones() {
    this.notStartedZone = false;
    this.wipZone = false;
    this.completedZone = false;
    this.rejectedZone = false;
    this.resolvedZone = false;
    this.reworkZone = false;
  }

  getOptions(task) {
    return {
      hide: { owner: false, statusAction: true, dueDate: true, actionView: 'action' },
      fields: []
    };
  }

  onClose(item) {
    item.isSelected = !item.isSelected;
    this.selectedIndex = null;
  }

  getDelay(item) {
    const adate = moment(item.plan.finish);
    const bdate = moment(item.actual.finish);
    const days = bdate.diff(adate, 'days');
    if (days > 0) {
      return days;
    } else {
      return '0';
    }
  }

  getStatusByList(item, kanbanList: string): State {
    const next = item.currentStatus.next;

    switch (kanbanList) {
      case 'not-started':
        return next.find((i) => i.isFirst || i.isDraft);

      case 'wip':
        return next.find((i) => !(i.isFirst || i.isDraft || i.isFinal));

      case 'rework':
        return next.find((i) => i.isPaused && i.isCancelled);

      case 'resolved':
        return next.find((i) => i.isPaused && !i.isCancelled);

      case 'completed':
        return next.find((i) => i.isFinal && !i.isCancelled);

      case 'rejected':
        return next.find((i) => i.isFinal && i.isCancelled);
    }

    return;

  }

  onChange($event, item: Task, from) {
    item.isSelected = false;
    if (!$event) {
      return;
    }
    if (from === 'reminder') {
      item.plan.reminder = $event;
    }
    if (from === 'dueDate') {
      item.plan.finish = $event;
    }
    if (from === 'assignee') {
      item.assignee = $event;
    }
    if (from === 'startDate') {
      item.plan.start = $event;
    }
    this.save(item);
  }

  save(item) {
    this.isProcessing = true;
    this.update(item).subscribe((i) => {
      this.isProcessing = false;
    });
  }

  getEntity(item: Task) {
    if (!item) {
      return;
    }

    if (item.parent && item.parent.entity) {
      return item.parent.entity;
    }

    return item.entity;
  }

  onItemDrop($event, group: any) {
    this.selectedItem = null;

    const id = $event.dataTransfer.getData('id');
    const item = this.items.find((i) => i.id === id);

    let listId; // TODO: get from group
    let listType; // TODO: get from group

    switch (listType) {
      case 'kanban':
        this.resetZones();
        const status = this.getStatusByList(item, listId);
        this.taskService.updateStatus(item, status).subscribe(() => {
          this.groupByStatus();
        });
        break;

      case 'sprint':
        this.sprints.forEach((i) => i.isSelected = false);

        const oldSprint = this.sprints.find((i) => {
          if (!item.sprint) { return !i.id; }
          return (i.id === item.sprint.id);
        });
        const newSprint = this.sprints.find((i) => i.id === listId);

        if (oldSprint.id === newSprint.id) { break; }

        this.taskService.updateSprint(item, new Sprint({ id: listId })).subscribe(() => {
          oldSprint.tasks = oldSprint.tasks.filter((t) => t.id !== item.id);
          newSprint.tasks.unshift(item);
          this.taskUpdated.emit(item);
        });

        break;
    }
  }

  onDragOver($event, listName: any) {
    // this.resetZones();
    // this.selectedItem = null;
    $event.preventDefault();
  }

  onItemDragStart($event, item: Task) {
    // $event.preventDefault();
    // $event.stopPropagation();

    $event.dataTransfer.setData('id', item.id);

    switch (this.view) {
      case 'kanban':
        const next = item.currentStatus.next;
        next.map((i) => this.getKanbanListName(i));

        const currentList = this.getKanbanListName(item.currentStatus);

        const isDroppableZone = (listName) => {
          return currentList !== listName && !!next.find((i) => this.getKanbanListName(i) === listName);
        };

        this.notStartedZone = isDroppableZone('not-started');
        this.wipZone = isDroppableZone('wip');
        this.completedZone = isDroppableZone('completed');
        this.rejectedZone = isDroppableZone('rejected');
        this.resolvedZone = isDroppableZone('resolved');
        this.reworkZone = isDroppableZone('rework');
        break;

      case 'sprint':
        if (!item.sprint) {
          this.sprints.forEach((s) => {
            s.isSelected = !!s.id;
          });
        } else {
          this.sprints.forEach((s) => {
            s.isSelected = item.sprint.id !== s.id;
          });
        }
        break;
    }

    this.selectedItem = item;
  }

  onItemDragEnd($event, item: Task) {
    $event.preventDefault();
    $event.stopPropagation();

    switch (this.view) {
      case 'kanban':
        this.resetZones();
        break;
      case 'sprint':
        this.sprints.forEach((s) => s.isSelected = false);
        break;
    }

    this.selectedItem = null;
  }

  isOverdue(item: any) {
    if (!item.plan || !item.plan.finish) {
      return;
    }

    return this.dateService.date(item.plan.finish).isPast();
  }

  onNewSprint() {
    const dialogRef = this.uxService.openDialog(SprintDetailComponent);

    dialogRef.componentInstance.properties = new Sprint({
      project: {
        id: this.project.id,
        code: this.project.code
      }
    });

    dialogRef.afterClosed().subscribe((sprint: Sprint) => {
      if (!sprint) {
        return;
      }

      const sprints = this.sprints.filter((s) => s.code !== 'backlog');

      sprints.push(sprint);
      sprints.push(this.sprints.find((s) => s.code === 'backlog'));
      this.sprints = sprints;
    });
  }

  onEditSprint(item: Sprint) {
    const dialogRef = this.uxService.openDialog(SprintDetailComponent);

    dialogRef.componentInstance.properties = item;

    dialogRef.afterClosed().subscribe((sprint: Sprint) => {
      if (!sprint) {
        return;
      }
    });
  }

  toggleSprint(sprint: Sprint) {
    sprint.isSelected = !sprint.isSelected;
    if (sprint.isSelected) { this.populateSprint(sprint); }
    // this.selectedSprint = (this.selectedSprintIndex === index) ? (this.selectedSprint === 'summary' ? 'details' : 'summary') : 'details';
    // this.selectedSprintIndex = index;
  }

  populateSprint(sprint: Sprint) {
    if (sprint.tasks && sprint.tasks.length) {
      return;
    }

    sprint.isProcessing = true;

    this.sprint = sprint.id as any;
    this.filters.set('sprint', this.sprint)
    this.fetch().subscribe((p) => {
      sprint.tasks = p.items;
      this.merge(p.items);
      sprint.isProcessing = false;
    });
    // this.taskService.search({
    //   sprint: sprint.id,
    //   project: this.project.id,
    //   assignee: this.assignee
    // }).subscribe((p) => {
    //   sprint.tasks = p.items;
    //   this.merge(p.items);
    //   sprint.isProcessing = false;
    // });
  }

  setRelease($event, task) {
    let value = $event.checked
    if (value) {
      this.attach(task)
    } else {
      this.detach(task)
    }
  }
}
