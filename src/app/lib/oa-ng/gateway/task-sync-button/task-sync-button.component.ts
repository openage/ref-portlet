import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { TaskSyncButtonBaseComponent } from 'src/app/lib/oa/gateway/components/task-sync-button.base.component';
import { TaskService } from 'src/app/lib/oa/gateway/services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'gateway-task-sync-button',
  templateUrl: './task-sync-button.component.html',
  styleUrls: ['./task-sync-button.component.css']
})
export class TaskSyncButtonComponent extends TaskSyncButtonBaseComponent {

  constructor(
    taskService: TaskService,
    uxService: UxService
  ) {
    super(taskService, uxService);
  }

}
