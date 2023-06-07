import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ErrorHandler, EventEmitter, Output } from '@angular/core';
import { LogListBaseComponent } from 'src/app/lib/oa/insight/components/log-list.base.component';
import { Log } from 'src/app/lib/oa/insight/models/log.model';
import { LogService } from 'src/app/lib/oa/insight/services/log.service';

@Component({
  selector: 'insight-log-list',
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class LogListComponent extends LogListBaseComponent {

  expandedElement: Log;

  @Output()
  contextSelected: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  serviceSelected: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    api: LogService,
    errorHandler: ErrorHandler
  ) {
    super(api, errorHandler);
  }

}
