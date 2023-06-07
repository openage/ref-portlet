import { Component, OnInit } from '@angular/core';
import { ActivitiesBaseComponent } from 'src/app/lib/oa/insight/components/activities.base.component';
import { UxService } from 'src/app/core/services/ux.service';
import { JournalService } from 'src/app/lib/oa/insight/services/journal.service';

@Component({
  selector: 'insight-activity-summary',
  templateUrl: './activity-summary.component.html',
  styleUrls: ['./activity-summary.component.css']
})
export class ActivitySummaryComponent extends ActivitiesBaseComponent {
  constructor(
    service: JournalService,
    uxService: UxService
  ) {
    super(service, uxService);
  }

}
