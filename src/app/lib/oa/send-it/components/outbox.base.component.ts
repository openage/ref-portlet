import { Component, ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';

import { Message } from 'src/app/lib/oa/send-it/models';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { PagerModel } from 'src/app/lib/oa/core/structures';

@Directive()
export class OutboxBaseComponent extends PagerModel<Message> implements OnInit, OnChanges {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  @Input()
  unread = false;

  @Input()
  sort = 'date';

  selectedSubject: string;

  constructor(
    private service: MessageService,
    private errorHandler: ErrorHandler
  ) {
    super({
      api: service,
      filters: ['from', 'subject', 'status'],
      pageOptions: { limit: 20 },
      errorHandler
    });
  }

  ngOnInit() {
    this.refresh();
  }

  ngOnChanges() {
    this.refresh();
  }

  refresh() {
    this.filters.properties['from'].value = 'my';

    if (this.selectedSubject) {
      this.filters.properties['subject'].value = this.selectedSubject;
    }
    this.fetch();
  }
}
