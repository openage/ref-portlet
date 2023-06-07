import { Component, Directive, ErrorHandler, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { TemplateService } from 'src/app/lib/oa/send-it/services';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Template } from '../models';

@Directive()
export class TemplateListBaseComponent extends PagerModel<Template> implements OnInit, OnChanges, OnDestroy {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  @Input()
  apiLimit = 10;

  @Input()
  skipSubjectStore = false;

  @Input()
  level: string;

  @Input()
  code: string;

  @Input()
  name: string;

  @Input()
  category: string;

  afterProcessing: () => void;

  constructor(
    api: TemplateService,
    errorHandler: ErrorHandler
  ) {
    super({
      api,
      errorHandler,
      // pageOptions: { limit: limit },
      filters: ['level', 'name', 'code', 'category']
    });
  }
  ngOnInit(): void { }

  ngOnChanges() {
    this.refresh();
  }

  ngOnDestroy(): void { }

  refresh() {
    this.filters.reset(false);

    if (this.name !== undefined) {
      this.filters.set('name', this.name);
    }

    if (this.code !== undefined) {
      this.filters.set('code', this.code);
    }

    if (this.level) {
      this.filters.set('level', this.level);
    }

    if (this.category) {
      this.filters.set('category', this.category);
    }

    this.fetch({ limit: this.apiLimit, skipSubjectStore: this.skipSubjectStore }).subscribe(() => {
      if (this.afterProcessing) {
        this.afterProcessing();
      }
    });
  }
}
