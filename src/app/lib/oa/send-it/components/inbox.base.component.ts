import { ErrorHandler, Input, OnChanges, OnInit, Directive, OnDestroy } from '@angular/core';
import { Message } from 'src/app/lib/oa/send-it/models';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { RoleService } from '../../core/services';

@Directive()
export class InboxBaseComponent extends PagerModel<Message> implements OnInit, OnChanges, OnDestroy {

  @Input()
  view = 'table';

  @Input()
  unread = false;

  @Input()
  sort = 'date';

  @Input()
  from: string;

  @Input()
  to: string;

  @Input()
  fromDate: Date;

  @Input()
  toDate: Date;

  @Input()
  autoRefreshTime = 10;

  @Input()
  apiLimit = 10;

  @Input()
  isAutoRefresh = true;

  @Input()
  selectedSubject: string;

  @Input()
  category: string;

  @Input()
  config: any = {};

  countOnly = false;

  draftCount: number;

  timeOut: any;

  constructor(
    private service: MessageService,
    private errorHandler: ErrorHandler,
    private auth: RoleService
  ) {
    super({
      api: service,
      filters: ['to', 'subject', 'status', 'status-code', 'mode', 'fromDate', 'toDate', 'from', 'countOnly', 'category'],
      pageOptions: { limit: 10 },
      errorHandler
    });
  }

  ngOnInit() {
    this.config = this.config || {};
    this.view = this.config.view || this.view;
    this.refresh(this.countOnly);
  }

  ngOnChanges() {
    this.refresh(this.countOnly);
  }

  refresh(countOnly?: boolean) {
    this.filters.reset(false);
    if (this.to) {
      this.filters.properties['to'].value = this.to;
    } else {
      this.filters.properties['to'].value = 'my';
    }

    if (this.isAutoRefresh) {
      this.filters.properties['status'].value = 'delivered';
    } else {
      this.filters.properties['status-code'].value = 'viewed,delivered';
    }

    if (this.category) {
      this.filters.properties['category'].value = this.category;
    }

    // this.filters.properties['mode'].value = 'email';
    if (this.from) {
      this.filters.properties['from'].value = this.from;
    }
    if (this.selectedSubject) {
      this.filters.properties['subject'].value = this.selectedSubject;
    }
    if (this.fromDate) {
      this.filters.properties['fromDate'].value = this.fromDate;
    }
    if (this.toDate) {
      this.filters.properties['toDate'].value = this.toDate;
    }

    if (countOnly) {
      this.filters.properties['countOnly'].value = true;
    }
    this.currentPageNo = 1;

    this.fetch({
      limit: this.apiLimit
    }).subscribe((page) => {
      if (this.isAutoRefresh && countOnly) {
        this.autoRefresh();
        this.draftCount = page.total;
        return;
      }
      this.unread = !!page.items.find((i) => i.status !== 'queued' && i.status === 'delivered');
    });
  }

  ngOnDestroy() {
    clearTimeout(this.timeOut);
  }

  autoRefresh() {
    this.timeOut = setTimeout(() => {
      if (this.auth.currentRole() && this.auth.currentRole().key) {
        this.refresh(true);
      }
    }, this.autoRefreshTime * 1000);
  }

  onView(message) {
    if (message.status !== 'viewed') {
      message.status = 'viewed';
      this.service.update(message.id, { status: 'viewed' }).subscribe((res) => { });
    }
  }

  onViewAll(items) {
    let data: Message[] = [];
    if (items && items.length) {
      data = items.map((item) => {
        item.status = 'viewed';
        return { _id: item.id, status: item.status };
      });
      this.service.bulk(data, 'bulk').subscribe((res) => {
        this.draftCount = items.length ? this.draftCount - items.length : this.draftCount
      });
    }
  }
}
