import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Template, TemplateConfig } from '../models';
import { TemplateDataSource } from '../models/template-data-source.model';
import { TemplateService } from '../services/template.service';

export class TemplateNewBaseComponent extends DetailBase<Template> implements OnInit {

  @Input()
  readonly = false;

  @Input()
  level: string;

  content: string;

  checked: boolean;

  template = new Template({});

  constructor(
    api: TemplateService,
    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() { }

  addContent($event) {
    this.template.body = $event;
  }

  dataSourceTypeChanged() {
    this.template.dataSource.params = [];
    // switch(this.properties.dataSource.type) {
    //   case 'ams':

    // }
  }
}
