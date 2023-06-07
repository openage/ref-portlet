import { Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Template } from '../models/template.model';
import { TemplateService } from '../services/template.service';

@Directive()
export class TemplateDetailBaseComponent extends DetailBase<Template> implements OnInit, OnChanges {

  @Input()
  code: string;

  afterProcessing: () => void;

  constructor(
    api: TemplateService
  ) {
    super({ api });
  }

  ngOnInit() {
    if (this.code && this.code === 'new') {
      this.properties = new Template({})
    } else if (this.code) {
      this.get(this.code).subscribe((item) => {
        if (this.afterProcessing) { this.afterProcessing(); }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
