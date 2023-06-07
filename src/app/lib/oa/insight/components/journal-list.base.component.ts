import { ErrorHandler, Input, OnChanges, OnInit, Directive } from '@angular/core';
import { Entity, PageOptions } from '../../core/models';
import { PagerModel } from '../../core/structures';
import { Journal } from '../models';
import { JournalService } from '../services/journal.service';

@Directive()
export class JournalListBaseComponent extends PagerModel<Journal> implements OnInit, OnChanges {

  @Input()
  entity: Entity;

  @Input()
  parentEntity: Entity;

  @Input()
  type: string;

  @Input()
  user: string;

  @Input()
  fromDate: Date;

  @Input()
  entityType: string;

  @Input()
  toDate: Date;

  @Input()
  field: string;

  @Input()
  refreshSeconds = 0;

  @Input()
  params: any = {};

  @Input()
  state: string;

  isProcessing = false;

  afterInitialization: () => void;
  afterProcessing: () => void;

  constructor(
    api: JournalService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      pageOptions: {
        limit: 10
      },
      filters: ['entity-id', 'entity-type', 'parentEntity-id', 'parentEntity-type', 'type', 'changes-field', 'user', 'fromDate', 'toDate', 'entityType', 'meta-state']
    });
  }

  ngOnInit(): void { }

  ngOnChanges(): void {
    this.getData();
  }

  getData() {
    this.filters.reset(false);
    if (this.entity) {
      if (this.entity.id) {
        this.filters.properties['entity-id'].value = this.entity.id;
      }
      if (this.entity.type) {
        this.filters.properties['entity-type'].value = this.entity.type;
      }
    }
    if (this.parentEntity) {
      if (this.parentEntity.id) {
        this.filters.properties['parentEntity-id'].value = this.parentEntity.id;
      }
      if (this.parentEntity.type) {
        this.filters.properties['parentEntity-type'].value = this.parentEntity.type;
      }
    }
    if (this.type) {
      this.filters.properties['type'].value = this.type;
    }
    if (this.field) {
      this.filters.properties['changes-field'].value = this.field;
    }
    if (this.user) {
      this.filters.properties['user'].value = this.user;
    }
    if (this.fromDate) {
      this.filters.properties['fromDate'].value = this.fromDate;
    }
    if (this.toDate) {
      this.filters.properties['toDate'].value = this.toDate;
    }
    if (this.entityType) {
      this.filters.properties['entityType'].value = this.entityType;
    }
    if (this.state) {
      this.filters.properties['meta-state'].value = this.state;
    }

    this.fetch().subscribe(() => {
      if (this.afterProcessing) { this.afterProcessing(); }
    });

    if (this.refreshSeconds) {
      setTimeout(() => {
        this.getData();
      }, this.refreshSeconds * 1000);
    }
  }
}
