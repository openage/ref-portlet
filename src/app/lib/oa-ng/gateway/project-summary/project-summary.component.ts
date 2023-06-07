import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/lib/oa/gateway/services/project.service';
import { UxService } from 'src/app/core/services';
import { ProjectDetailBaseComponent } from 'src/app/lib/oa/gateway/components/project-detail.base.component';
import { SprintService, TaskService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-project-summary',
  templateUrl: './project-summary.component.html',
  styleUrls: ['./project-summary.component.css']
})
export class ProjectSummaryComponent extends ProjectDetailBaseComponent {

  constructor(
    service: ProjectService,
    sprintService: SprintService,
    storyService: TaskService,
    uxService: UxService
  ) {
    super(service, sprintService, storyService, uxService);
  }

}
