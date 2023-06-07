import { Component, OnInit, ViewChild } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { ReleaseDetailBaseComponent } from 'src/app/lib/oa/gateway/components/release-detail.base.component';
import { ReleaseService } from 'src/app/lib/oa/gateway/services';
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'gateway-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css']
})
export class ReleaseComponent extends ReleaseDetailBaseComponent {

  @ViewChild('releaseTasklist')
  releaseTasklist: TaskListComponent

  @ViewChild('tasklist')
  tasklist: TaskListComponent

  subject: string;
  releaseSubject: string;
  listCode: string;
  listType: string = 'story,defect';

  constructor(
    uxService: UxService,
    api: ReleaseService
  ) {
    super(uxService, api);
  }
}
