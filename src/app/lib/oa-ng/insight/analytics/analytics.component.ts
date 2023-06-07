import { Component, Input, OnInit } from '@angular/core';
import { AnalyticsBaseComponent } from 'src/app/lib/oa/insight/components/analytics.base.component';
import { StatGridService } from 'src/app/lib/oa/insight/services/stat-grid.service';
import { Link } from 'src/app/lib/oa/core/structures';
import { UxService } from 'src/app/core/services/ux.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'insight-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent extends AnalyticsBaseComponent {
  @Input()
  view: string;

  @Input()
  links: Link[] = [];

  @Input()
  noOfColumns = 'two';

  constructor(
    statService: StatGridService,
    uxService: UxService
  ) {
    super(statService, uxService);
  }

}
