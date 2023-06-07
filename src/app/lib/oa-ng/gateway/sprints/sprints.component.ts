import { Component, Input, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { DateService } from 'src/app/lib/oa/core/services';
import { SprintListBaseComponent } from 'src/app/lib/oa/gateway/components/sprint-list.base.component';
import { SprintService, TaskService } from 'src/app/lib/oa/gateway/services';
import { MatDialog } from '@angular/material/dialog';
import { Sprint } from 'src/app/lib/oa/gateway/models';
import { CloseSprintDialogComponent } from '../close-sprint-dialog/close-sprint-dialog.component';

@Component({
  selector: 'gateway-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.css']
})
export class SprintsComponent extends SprintListBaseComponent {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  columns = ['code', 'name', 'description', 'start', 'end', 'status', 'action'];

  constructor(
    public sprintService: SprintService,
    taskService: TaskService,
    dateService: DateService,
    uxService: UxService,
    public dialog: MatDialog
  ) {
    super(sprintService, taskService, dateService, uxService);
  }

  openDialog(item: Sprint) {
    const dialogRef = this.dialog.open(CloseSprintDialogComponent, {
      width: "500px"
    });

    const instance = dialogRef.componentInstance;
    instance.items = this.items.map(item => {
      if (item.status == 'new') { return { code: item.code, label: item.name } }
    }).filter(Boolean)

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let model = result.code ? { newSprint: result.code } : {};
        this.isProcessing = true

        this.sprintService.update(`${item.id}/close`, model).subscribe((data) => {
          item = new Sprint(data)
          this.isProcessing = false
        }, err => { this.isProcessing = false });
      }
    });
  }
}
