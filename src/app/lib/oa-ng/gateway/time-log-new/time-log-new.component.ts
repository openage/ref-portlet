import { Component, Input } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { TimeLogNewBaseComponent } from 'src/app/lib/oa/gateway/components/time-log-new.base.component';
import { TimeLogService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-time-log-new',
  templateUrl: './time-log-new.component.html',
  styleUrls: ['./time-log-new.component.css']
})

export class TimeLogNewComponent extends TimeLogNewBaseComponent {
  @Input()
  options: any;

  constructor(
    timeLogService: TimeLogService,
    uxService: UxService,
    public auth: RoleService
  ) {
    super(timeLogService, uxService)
  }

}
