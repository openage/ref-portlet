import { TimeLine } from 'src/app/lib/oa/gateway/models/timeline.model';
import { Directive, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorHandler, Input, OnInit } from '@angular/core';
import { Entity, IUser } from '../../core/models';
import { RoleService } from '../../core/services';
import { DetailBase } from '../../core/structures';
import { Employee, Organization } from '../../directory/models';
import { Project, Release, Sprint, Task } from '../models';
import { Workflow } from '../models/workflow.model';
import { ProjectService, TaskService } from '../services';

@Directive()
export class TaskNewBaseComponent extends DetailBase<Task> implements OnInit, OnChanges {

  @Input()
  type: string;

  @Input()
  entity: Entity;

  @Input()
  project: Project;

  @Input()
  parent: Task;

  @Input()
  organization: Organization;

  @Input()
  release: Release;

  @Input()
  sprint: Sprint;

  @Input()
  workflow: Workflow;

  @Input()
  assignee: IUser;

  @Input()
  priority = 3;

  @Input()
  dueDate: Date;

  @Input()
  startDate: Date;

  @Input()
  types: any[] = [];

  @Input()
  sprints: Sprint[] = [];

  @Input()
  placeholder = 'New Task';

  @Input()
  task: Task = new Task({});

  oaOnCreate: (item: Task) => void;

  workflows: Workflow[];


  typeToggler: any;


  isProcessing: boolean;

  templates: {
    creator?: any;
    editor?: any;
    viewer?: any;
  }

  constructor(
    api: TaskService,
    errorHandler: ErrorHandler,
    private auth: RoleService
  ) {
    super({ api, errorHandler });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.parent && this.parent.workflow && this.parent.workflow.children) {
      this.setWorkflows(this.parent.workflow.children);
    } else if (this.project) {
      if (this.project.type) {
        this.setWorkflows(this.project.type.workflows);
      }
      this.sprints = this.project.sprints;
      this.sprint = this.sprints.find((s) => s.code === 'backlog');
    }
  }

  ngOnInit() {
    if (!this.organization) {
      this.organization = this.auth.currentOrganization();
    }

    this.typeToggler = {
      type: 'toggler',
      view: 'icon',
      value: this.type,
      items: this.types,
      event: (i) => this.type = i
    };
  }

  setWorkflows(workflows: Workflow[]): void {
    this.types = workflows.map((w) => {
      return {
        code: w.code,
        label: w.name,
        class: 'md',
        icon: w.icon || `oa-workflow-${w.code}`
      };
    });

    this.type = this.types[0].code;
    this.placeholder = `New ${this.type}`
  }

  onSelectType($event) {
    this.type = $event;
    this.placeholder = `New ${this.type}`

    let workflow = (this.project?.type?.workflows || []).find(w => w.code == this.type)
    this.templates = workflow.templates;
  }

  onSetWorkflow(workflow: Workflow) {
    this.type = workflow.code;
  }

  onSelectDueDate($event) {
    this.dueDate = $event;
  }

  onSelectPriority($event) {
    this.priority = $event;
  }

  onSelectAssignee($event) {
    this.assignee = $event;
    
    if (this.task) {
      this.task.assignee = new IUser({
        code: $event.code,
        role: { id: $event.id }
      })
    }
  }

  onSelectSprint($event) {
    this.sprint = $event;
  }

  onDueDateChange($event) {
    this.task.plan = new TimeLine(this.task.plan);
    this.task.plan.finish = $event;
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
    this.task.size = minutes
  }

  // validate() {
  //   return !!(!this.task.type || !this.task.assignee.email || !this.task.subject || !this.task.description
  //     || this.isProcessing);
  // }

  onCreate(subject: string) {

    if (!subject) {
      return;
    }

    this.task.subject = subject;

    if (this.type) {
      this.task.type = this.type;
    }

    if (this.workflow) {
      this.task.workflow = new Workflow({ id: this.workflow.id });
    }

    if (this.parent) {
      this.task.parent = new Task({ id: this.parent.id });
    }

    if (this.project) {
      this.task.project = new Project({ id: this.project.id });
    }

    if (this.release) {
      this.task.release = new Release({ id: this.release.id });
    }

    if (this.dueDate) {
      this.task.plan.finish = this.dueDate;
    }

    if (this.startDate) {
      this.task.plan.start = this.startDate;
    }

    if (this.sprint && this.sprint.code !== 'backlog') {
      this.task.sprint = new Sprint({ id: this.sprint.id });
    }

    this.task.entity = new Entity(this.entity || this.project.entity || {});
    this.task.organization = null

    if (this.organization) {
      // this.task.organization = this.organization
    }
    this.create(this.task).subscribe();
  }

}
