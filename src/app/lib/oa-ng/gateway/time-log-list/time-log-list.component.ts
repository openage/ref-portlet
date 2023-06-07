import { Component, Input } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { TimeLogListBaseComponent } from 'src/app/lib/oa/gateway/components/time-log-list.base.component';
import { Project, Release, Sprint, Task, TimeLog } from 'src/app/lib/oa/gateway/models';
import { TimeLogService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-time-log-list',
  templateUrl: './time-log-list.component.html',
  styleUrls: ['./time-log-list.component.css']
})
export class TimeLogListComponent extends TimeLogListBaseComponent {

  @Input()
  readonly: boolean = false;

  newItem: TimeLog = new TimeLog({
    date: new Date(),
    isProcessing: false
  });
  // date = new Date();
  // activity: string;
  // minutes = 0;
  // comment: string;

  activities = ['analysis', 'discussion', 'doing', 'reviewing'];

  constructor(
    timeLogService: TimeLogService,
    public uxService: UxService,
    public auth: RoleService
  ) {
    super(timeLogService, uxService);
  }

  onDurationChanged($event) {
    switch ($event.unit.code) {
      case 'min':
        this.newItem.minutes = $event.value;
        break;
      case 'hr':
        this.newItem.minutes = $event.value * 60;
        break;
      case 'day':
        this.newItem.minutes = $event.value * 60 * 8;
        break;
    }
  }

  onDateChange($event) {
    this.newItem.date = $event
  }

  addNewItem() {
    this.newItem.isProcessing = true;
    if (this.task) {
      this.newItem.task = new Task({ id: this.task.id });
    }

    if (this.project) {
      this.newItem.project = new Project({ code: this.project.code });
    }

    if (this.release) {
      this.newItem.release = new Release({ id: this.release.id });
    }

    if (this.sprint) {
      this.newItem.sprint = new Sprint({ id: this.sprint.id });
    }

    return this.create(this.newItem).subscribe(() => {
      this.uxService.showInfo('TimeLog', 'TimeLog added successfully');

      this.newItem = new TimeLog({
        date: new Date(),
        isProcessing: false
      });
    });
  }

  removeTimeLog(item: TimeLog) {
    this.remove(item).subscribe(() => {
      this.uxService.showInfo('TimeLog', 'TimeLog removed successfully');
    });
  }

}
