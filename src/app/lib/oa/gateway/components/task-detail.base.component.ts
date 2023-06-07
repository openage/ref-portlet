import { Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import * as moment from 'moment';
import { UxService } from 'src/app/core/services';
import { Slide } from 'src/app/lib/oa/core/models';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Category, Project, Release, Sprint, Task, User, Workflow } from 'src/app/lib/oa/gateway/models';
import { IUser } from '../../core/models';
import { State } from '../models/state.model';
import { TimeLine } from '../models/timeline.model';
import { ProjectService } from '../services';
import { TaskService } from '../services/task.service';

@Directive()
export class IssueDetailBaseComponent extends DetailBase<Task> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly = false;

  @Input()
  categories: Category[] = [];

  @Input()
  sprints: Sprint[] = [];

  @Input()
  releases: Release[] = [];

  @Input()
  users: IUser[] = [];

  @Input()
  project: Project;

  @Input()
  sprint: Sprint;

  @Input()
  release: Release;

  @Input()
  user: User;

  delay = 0;

  content: string;

  thumbnail: string;

  readyToReceive = false;

  next: State[] = [];

  workflows: Workflow[] = [];

  tag: string;

  templates: {
    creator?: any;
    editor?: any;
    viewer?: any;
  }

  constructor(
    public uxService: UxService,
    public issueService: TaskService,
    private projectService: ProjectService
  ) {
    super({
      api: issueService
    });
  }

  ngOnInit() {
    this.preInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init();
  }

  private init() {
    if (!this.properties) {
      const code = this.project ? `${this.code}?project=${this.project.id || this.project.code}` : this.code;
      return this.get(code).subscribe(() => this.init());
    }
    this.content = this.properties.description;
    this.templates = this.properties.workflow?.templates;

    if (this.properties.project) {
      this.projectService.get(this.properties.project.id).subscribe(p => {
        this.project = p;
        this.setWorkflows(this.project.type.workflows);
        this.sprints = this.project.sprints;
        this.releases = this.project.releases;
        this.users = this.project.members.map(m => m.user)
      })
    }
    // const status: any = this.properties.status;
    // this.properties.currentStatus = status ?
    //   this.properties.workflow.states.find((s) => s.code === status.code) :
    //   this.properties.workflow.states.find((s) => s.isFirst);

    // this.attachments = this.issueService.getAttachments(this.properties);
    // if (this.attachments.length) {
    //   this.thumbnail = this.attachments[this.attachments.length - 1].thumbnail;
    // }

    // this.properties.children = this.properties.children || [];

    // this.calculate();
  }

  setWorkflows(workflows: Workflow[]): void {
    this.workflows = workflows;
    this.workflows.forEach((w) => w.icon = w.icon || `oa-workflow-${w.code}`);
  }

  copy() {
    const el = document.createElement('textarea');
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.opacity = '0';
    el.value = `${this.properties.subject}
${this.properties.type} #${this.properties.id}`;
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  updateStatus(status: State) {
    if (this.properties.currentStatus && this.properties.currentStatus.code === status.code) {
      return;
    }
    this.issueService
      .updateStatus(this.properties, status)
      .subscribe(() => {
        this.properties.currentStatus = this.properties.workflow.states.find((s) => s.code === status.code);
        this.updated.emit(this.properties);
      });
  }

  onSetOwner(user: IUser) {
    this.issueService
      .updateOwner(this.properties, user)
      .subscribe(() => this.updated.emit(this.properties));
  }

  onSetAssignee(user: User) {
    this.issueService
      .updateAssignee(this.properties, user)
      .subscribe(() => this.updated.emit(this.properties));
  }

  updateSprint(sprint: Sprint) {
    if (this.properties.sprint && this.properties.sprint.id === sprint.id) {
      return;
    }

    this.issueService
      .updateSprint(this.properties, sprint)
      .subscribe(() => this.updated.emit(this.properties));
  }

  updateCategory(category: Category) {
    if (this.properties.category && this.properties.category.id === category.id) {
      return;
    }

    this.issueService
      .updateCategory(this.properties, category)
      .subscribe(() => this.updated.emit(this.properties));
  }

  updateSubject($event: any) {
    // this.properties.isEditing = false;

    const subject = $event;

    if (!subject) {
      return;
    }

    this.issueService
      .updateSubject(this.properties, subject)
      .subscribe(() => this.updated.emit(this.properties));
  }

  onSlidesUpdate(slides: Slide[]) {
    let description = '';

    slides.forEach((item) => {
      description += (description === '' ? '' : '<div>---</div>') + item.description;
    });

    this.updateDescription(description);

  }

  updateDescription($event: any) {

    let newValue = $event;

    if (typeof newValue !== 'string') {
      newValue = this.uxService.getTextFromEvent($event);
    }

    if (!newValue) {
      return;
    }

    if (this.properties.description === newValue) {
      return;
    }

    this.issueService
      .updateDescription(this.properties, newValue)
      .subscribe(() => {
        // this.attachments = this.issueService.getAttachments(this.properties);
        this.updated.emit(this.properties);
      });
  }

  togglePriority() {
    this.issueService
      .updatePriority(this.properties, this.properties.priority)
      .subscribe(() => this.updated.emit(this.properties));
  }

  public calculate() {
    if (this.properties.plan && this.properties.actual && this.properties.plan.finish && this.properties.actual.finish) {
      const adate = moment(this.properties.plan.finish);
      const bdate = moment(this.properties.actual.finish);
      this.delay = bdate.diff(adate, 'minutes');
    }

    let totalPoints = 0;
    let burntPoints = 0;
    const story = this.properties;
    story.children.forEach((task) => {

      if (task.type !== 'task') {
        return;
      }

      totalPoints += task.points;
      if (task.status === 'done') {
        burntPoints += task.points;
      }
    });

    if (story.points === totalPoints && story.burnt === burntPoints) {
      return;
    }

    story.points = totalPoints;
    story.burnt = burntPoints;
    if (story.points !== story.burnt && story.status === 'done') {
      story.status = 'new';
    }

    // this.issueService.update(story.id, story).subscribe(() => this.updated.emit(this.properties));
  }

  onDescriptionUpdate(value) {
    this.issueService.update(this.properties.id, { description: value }).subscribe((item) => {
      this.uxService.showInfo('Content Updated Successfully')
    });
  }

  onAssigneeUpdate($event: IUser) {
    this.issueService.updateAssignee(this.properties, $event);
  }

  updateOwner($event: IUser) {
    this.issueService.updateOwner(this.properties, $event);
  }

  onMetaUpdate($event) {
    this.issueService.updateMeta(this.properties, $event.meta);
  }

  onPriorityChange($event) {
    if (typeof $event === 'string') {
      $event = parseInt($event, 10);
    }
    this.issueService.updatePriority(this.properties, $event);
  }

  onDueDateChange($event) {
    const plan = new TimeLine(this.properties.plan);
    plan.finish = $event;
    this.issueService.updatePlan(this.properties, plan)
  }

  onSizeChanged($event) {
    let minutes = 0

    switch ($event.unit.code) {
      case 'min':
        minutes = $event.value;
        break;
      case 'hr':
        minutes = $event.value * 60;
        break;
      case 'day':
        minutes = $event.value * 60 * 8;
        break;
    }
    this.issueService.updateSize(this.properties, minutes);
  }

  onPointsChanged(newValue) {
    if (typeof newValue === 'string') {
      newValue = parseInt(newValue, 10);
    }

    if (this.properties.points === newValue) {
      return;
    }
    this.issueService
      .updatePoints(this.properties, newValue)
      .subscribe(() => this.updated.emit(this.properties));
  }

  onSprintChange($event) {
    this.issueService.updateSprint(this.properties, $event);
  }

  onParentChange($event) {
    this.issueService.updateParent(this.properties, $event);
  }

  onReleaseChange($event) {
    this.issueService.updateRelease(this.properties, $event);
  }

  onWorkflowChange($event) {
    this.issueService.updateWorkflow(this.properties, $event);
  }

  onTagsChange($event) {
    this.issueService
      .update(this.properties.id, { tags: $event })
      .subscribe(() => this.updated.emit(this.properties));
  }

  // addTag($event) {
  //   const value = this.uxService.getTextFromEvent($event);
  //   if (value && !this.properties.tags.includes(value)) {
  //     this.properties.tags.push(value);
  //     this.issueService
  //       .update(this.properties.id, { tags: this.properties.tags })
  //       .subscribe(() => this.updated.emit(this.properties));
  //   }
  //   this.tag = undefined;
  // }

  // removeTag(index) {
  //   this.properties.tags.splice(index, 1);
  //   this.issueService
  //     .update(this.properties.id, { tags: this.properties.tags })
  //     .subscribe(() => this.updated.emit(this.properties));
  // }

}
