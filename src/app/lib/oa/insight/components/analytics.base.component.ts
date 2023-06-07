import { ErrorHandler, Input, OnInit, Directive } from '@angular/core';
import { StatGrid } from 'src/app/lib/oa/insight/models/stat-grid.model';
import { StatGridService } from 'src/app/lib/oa/insight/services/stat-grid.service';

@Directive()
export class AnalyticsBaseComponent implements OnInit {
  @Input()
  code: string;

  analytics: StatGrid = new StatGrid();

  constructor(
    private api: StatGridService,
    errorHandler: ErrorHandler
  ) {
  }

  ngOnInit() {
    this.api.get(this.code).subscribe((i) => this.analytics = i);
  }

}
