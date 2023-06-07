import { ErrorHandler, Input, OnInit, Directive } from '@angular/core';
import { StatGrid } from 'src/app/lib/oa/insight/models/stat-grid.model';
import { JournalService } from 'src/app/lib/oa/insight/services/journal.service';
import { PagerModel, PagerOptions } from 'src/app/lib/oa/core/structures';
import { Journal } from '../models/journal.model';
import { User } from '../models/user.model';

@Directive()
export class ActivitiesBaseComponent extends PagerModel<Journal> implements OnInit {
  @Input()
  user: User;

  activities: Journal[] = [];

  constructor(
    api: JournalService,
    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {
    this.fetch();
  }

}
