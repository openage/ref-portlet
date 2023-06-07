import { ErrorHandler, Input, OnChanges, OnInit, Directive } from '@angular/core';
import { PagerModel } from '../../core/structures';
import { Log } from '../models/log.model';
import { LogService } from '../services/log.service';

@Directive()
export class LogListBaseComponent extends PagerModel<Log> implements OnInit, OnChanges {

  @Input()
  columns: string[] = ['level', 'date', 'context', 'message', 'action'];

  @Input()
  view: 'table' = 'table';

  @Input()
  level: string;

  @Input()
  app: string;

  @Input()
  service: string;

  @Input()
  message: string;

  @Input()
  user: string;

  @Input()
  organizationCode: string;

  @Input()
  from: Date | string;

  @Input()
  till: Date | string;

  @Input()
  contextId: Date | string;

  @Input()
  refreshSeconds = 0;

  @Input()
  params: any = {};

  isProcessing = false;

  constructor(
    api: LogService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      pageOptions: { limit: 50 },
      filters: ['level', 'app', 'service', 'message', 'context-id', 'organization-code', 'user', 'from', 'till']
    });
  }

  ngOnInit(): void { }

  ngOnChanges(): void {
    this.isProcessing = true;
    this.getData();
  }

  getData() {
    this.isProcessing = true;
    this.filters.reset(false);
    this.level = this.level || 'error';
    if (this.level !== 'all') {
      this.filters.properties['level'].value = this.level;
    }
    if (this.contextId) {
      this.filters.properties['context-id'].value = this.contextId;
    }
    if (this.organizationCode) {
      this.filters.properties['organization-code'].value = this.organizationCode;
    }
    if (this.user) {
      this.filters.properties['user'].value = this.user;
    }
    if (this.till) {
      this.filters.properties['till'].value = this.till;
    }
    if (this.from) {
      this.filters.properties['from'].value = this.from;
    }
    if (this.app) {
      this.filters.properties['app'].value = this.app;
    }
    if (this.service) {
      this.filters.properties['service'].value = this.service;
    }
    if (this.message) {
      this.filters.properties['message'].value = this.message;
    }

    this.fetch().subscribe(() => {
      this.isProcessing = false;
    });

    if (this.refreshSeconds) {
      setTimeout(() => {
        this.getData();
      }, this.refreshSeconds * 1000);
    }
  }
}
