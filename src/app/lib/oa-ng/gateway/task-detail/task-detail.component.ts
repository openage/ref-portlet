import { Component, Input } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { Action } from 'src/app/lib/oa/core/structures';
import { IssueDetailBaseComponent } from 'src/app/lib/oa/gateway/components/task-detail.base.component';
import { ProjectService, TaskService } from 'src/app/lib/oa/gateway/services';
@Component({
  selector: 'gateway-task-details',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent extends IssueDetailBaseComponent {

  @Input()
  view: 'slides' | 'details' | 'row' | 'attributes' = 'details';

  @Input()
  more: {
    extras?: Action[]
  }

  points: any[] = [];
  priorities: any[] = [];

  constructor(
    uxService: UxService,
    public taskService: TaskService,
    projectService: ProjectService
  ) {
    super(uxService, taskService, projectService);
    this.points = taskService.points;
    this.priorities = taskService.priorities;
  }

  onCopy() {
    const item = `${this.properties.type}#${this.properties.code}: ${this.properties.subject}`;
  }
}
