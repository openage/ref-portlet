import { Directive, ErrorHandler, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Template, TemplateConfig } from '../models';
import { TemplateService } from '../services/template.service';

@Directive()
export class TemplateDetailBaseComponent extends DetailBase<Template> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly = false;

  @Input()
  level: string;

  content: string;

  checked: boolean;

  constructor(
    api: TemplateService,
    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.code) {
      this.init(this.code);
    }
  }

  ngOnInit() {
    // this.init(this.code);
  }

  init(code) {
    if (code === 'new') {
      this.set(new Template({
        config: { page: {} }
      }));
    } else {
      this.get(code).subscribe(() => {
        this.content = this.properties.body;
        if (this.properties.status === 'active') { this.checked = true; }
        this.properties.config = new TemplateConfig(this.properties.config || {});
      });
    }
  }

  updateContent($event) {
    this.properties.body = $event;
  }

  dataSourceTypeChanged() {
    this.properties.dataSource.params = [];
    // switch(this.properties.dataSource.type) {
    //   case 'ams':

    // }
  }
}
