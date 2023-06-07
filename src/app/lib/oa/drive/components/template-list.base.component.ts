import { Component, ErrorHandler, Input, OnDestroy, OnInit, Directive } from '@angular/core';
import { PagerModel } from 'src/app/lib/oa/core/structures';
import { Template } from '../models/template.model';
import { TemplateService } from '../services';

@Directive()
export class TemplateListBaseComponent extends PagerModel<Template> implements OnInit, OnDestroy {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  @Input()
  level: string;

  constructor(
    private api: TemplateService,
    errorHandler: ErrorHandler
  ) {
    super({ api, pageOptions: { limit: 10 }, errorHandler, filters: ['level'] });
  }
  ngOnInit(): void {

    this.filters.properties['level'].value = this.level;
    this.fetch();
  }

  ngOnDestroy(): void {
  }
}
