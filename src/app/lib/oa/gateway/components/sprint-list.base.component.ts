import { Component, Directive, ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { PagerModel } from 'src/app/lib/oa/core/structures';
import { UxService } from 'src/app/core/services/ux.service';
import { DateService } from '../../core/services/date.service';
import { Project, Sprint, Task } from '../models';
import { TimeLine } from '../models/timeline.model';
import { SprintService } from '../services/sprint.service';
import { TaskService } from '../services/task.service';
@Directive()
export class SprintListBaseComponent extends PagerModel<Sprint> implements OnInit, OnChanges {

  @Input()
  project: Project | string;

  @Input()
  stories: Task[] = [];

  @Input()
  selectedCode: string;

  @Input()
  status: string;

  currentCode: string;

  codes: string[] = [];

  firstSprint: string;
  lastSprint: string;

  sprintMap: Map<string, Sprint>;
  backlog: Sprint;

  previous: Sprint[];
  future: Sprint[];

  constructor(
    public sprintService: SprintService,
    private taskService: TaskService,
    private dateService: DateService,
    private uxService: UxService
  ) {
    super({
      api: sprintService,
      errorHandler: uxService,
      filters: ['project', 'status']
    });
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.filters.reset(false);


    if (this.status) {
      this.filters.set('status', this.status);
    }

    if (!this.selectedCode) {
      const currentSprint = this.dateService.toWeek(new Date());
      this.selectedCode = `${currentSprint}`;
    }

    if (this.project) {
      if (typeof this.project === 'string') {
        this.filters.set('project', this.project);
      } else {
        this.filters.set('project', this.project.code);

        if (this.project.sprints) {
          this.items = this.project.sprints;

          this.showSprints(this.selectedCode);
          return this.calculatePoints();
        }
      }
    }



    this.fetch().subscribe(() => {
      this.showSprints(this.selectedCode);
      this.calculatePoints();
    });
  }

  nextSprints() {
    this.showSprints(this.lastSprint);
  }

  previousSprints() {
    this.showSprints(this.firstSprint);
  }

  showSprints(code: string) {
    const dates: Date[] = [];

    const fromWeek = Number(code);

    const firstSprint = fromWeek - 2;
    const lastSprint = fromWeek + 1;
    this.codes = [];
    for (let weekNumber = firstSprint; weekNumber <= lastSprint; weekNumber++) {
      this.codes.push(`${weekNumber}`);
    }

    this.firstSprint = `${firstSprint}`;
    this.lastSprint = `${lastSprint}`;

    this.sprintMap = new Map<string, Sprint>();
    this.previous = [];
    this.future = [];

    this.items.forEach((sprint) => {
      if (!sprint.name || sprint.name.toLowerCase() === 'backlog') {
        this.backlog = sprint;
      } else if (this.codes.find((week) => sprint.name === week)) {
        this.sprintMap.set(sprint.name, sprint);
      } else {
        const sprintNo = Number(sprint.name);
        if (isNaN(sprintNo) || sprintNo < firstSprint) {
          this.previous.push(sprint);
        } else {
          this.future.push(sprint);
        }
      }

      // sprint.users = [];
      // this.allUsers.forEach((user) => {
      //   sprint.users.push(new User(user));
      // });
    });

    if (!this.backlog) {
      this.backlog = this.createBacklog();
      this.items.push(this.backlog);
    }
  }

  toggleSelection(sprint: Sprint | string) {
    if (typeof sprint === 'string') {
      const selectedSprint = this.items.find((item) => item.name.toLowerCase() === sprint.toLowerCase());
      if (selectedSprint) {
        return this.toggleSelection(selectedSprint);
      }
      return this.selectSprint(sprint);
    }
    if (!sprint.isSelected) {
      this.selectSprint(sprint);
    } else {
      this.unselectSprint();
    }
  }

  selectSprint(sprint: Sprint | string) {
    if (typeof sprint === 'string') {
      const selectedSprint = this.items.find((item) => item.name.toLowerCase() === sprint.toLowerCase());
      if (selectedSprint) {
        return this.select(selectedSprint);
      }
      const newSprint = new Sprint();
      newSprint.name = sprint;

      newSprint.plan = new TimeLine();
      // eslint-disable-next-line radix
      newSprint.plan.finish = this.dateService.fromWeek(parseInt(newSprint.name));
      // newSprint.plan.start = this.dateService.fromWeek(parseInt(newSprint.name));

      return this.sprintService.create(newSprint).subscribe((item) => {
        this.items.push(item);
        this.showSprints(sprint);
        this.select(item);
      });
    }

    // this.items.forEach((item) => item.isEditing = false);
    // sprint.isEditing = true;
    this.select(sprint);

    // this.selected = sprint;
    // if (!this.viewOptions.weekNo || this.viewOptions.weekNo.toLowerCase() !== sprint.name.toLowerCase()) {
    //   this.uxService.setViewOptions({ weekNo: sprint.name });
    // }
    // this.select.next(this.selected);
  }

  unselectSprint() {
    this.select(null);
    // this.sprints.forEach((item) => item.isEditing = false);
    // this.selected = null;
    // this.uxService.setViewOptions({ weekNo: null });
    // this.select.next(this.selected);
  }

  onStoryDrop($event: any, sprint: Sprint | string) {

    if (typeof sprint === 'string') {
      const selectedSprint = this.items.find((item) => item.name.toLowerCase() === sprint.toLowerCase());
      if (selectedSprint) {
        return this.onStoryDrop($event, selectedSprint);
      }

      const newSprint = new Sprint();
      newSprint.name = sprint;

      // eslint-disable-next-line radix
      newSprint.plan = new TimeLine();
      // eslint-disable-next-line radix
      newSprint.plan.finish = this.dateService.fromWeek(parseInt(newSprint.name));
      // newSprint.plan.start = this.dateService.fromWeek(parseInt(newSprint.name));

      return this.sprintService.create(newSprint).subscribe((item) => {
        this.items.push(item);
        return this.onStoryDrop($event, item);
      });
    }

    const story = $event.dragData;
    this.taskService.updateSprint(story, sprint.name.toLowerCase() === 'backlog' ? null : sprint).subscribe(() => {
      this.calculatePoints();
    });
  }

  calculatePoints() {
    this.items.forEach((item) => {
      item.points = 0;
      item.burnt = 0;
    });

    if (!this.backlog) {
      this.backlog = this.createBacklog();
    }
    this.backlog.points = 0;
    this.backlog.burnt = 0;

    this.stories.forEach((item) => {
      const sprint = item.sprint || this.backlog;
      sprint.points += item.points;
      sprint.burnt += item.burnt;
    });
  }

  getPointSummary(sprint: Sprint | string) {
    if (!sprint) {
      return;
    }

    if (typeof sprint === 'string') {
      return this.getPointSummary(this.items.find((i) => i.name.toLowerCase() === sprint.toLowerCase()));
    }

    return `${sprint.points - sprint.burnt}/${sprint.points}`;
  }

  pointSummaryForSprints(sprints: Sprint[]) {

    let points = 0;
    let burnt = 0;
    sprints.forEach((sprint) => {
      points += sprint.points;
      burnt += sprint.burnt;
    });

    return `${points - burnt}/${points}`;
  }

  isOverdue(item) {
    if (!item.plan || !item.plan.finish) {
      return;
    }

    return this.dateService.date(item.plan.finish).isPast();
  }

  onNameChange(item: any, name: string) {
    return this.sprintService.update(item.id, { name });
  }

  onAddSprint(name: string) {
    return this.sprintService.create({ name });
  }

  onStatusChange(item: Sprint, status: string) {
    return this.sprintService.update(item.id, { status }).subscribe((data) => { item = new Sprint(data); });
  }

  private createBacklog() {
    const backlog = new Sprint();
    backlog.id = -1;
    backlog.code = 'backlog';
    backlog.name = 'Backlog';
    backlog.points = 0;
    backlog.burnt = 0;
    backlog.status = 'open';
    backlog.members = [];

    return backlog;
  }

}
