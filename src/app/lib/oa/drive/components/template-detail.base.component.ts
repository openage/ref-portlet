import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Template } from '../models/template.model';
import { TemplateService } from '../services/template.service';

@Directive()
export class TemplateDetailBaseComponent extends DetailBase<Template> implements OnInit, OnChanges {

  @Input()
  code: string;

  content: string;

  contentEdit: boolean;

  editJson: boolean;

  constructor(
    api: TemplateService,
    errorHandler: ErrorHandler
  ) {
    super({ api, errorHandler });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.init(this.code);
  }

  ngOnInit() {
    this.init(this.code);
  }

  init(code) {
    if (code === 'new') {
      this.set(new Template({}));
    } else {
      this.get(code).subscribe((item) => {
        this.content = item.content;
      })
    }
  }

  onSave() {
    this.properties.content = this.content;
    this.save();
  }

  setContent($event) {
    this.content = $event.target.textContent;
  }

  setDataSource($event) {
    this.properties.dataSource = $event
  }

  setMeta($event) {
    this.properties.meta = $event
  }

  setHooks($event) {
    this.properties.hooks = $event;
  }

  setMergeWithFiles($event) {
    this.properties.mergeWithFiles = $event;
  }

  setTemplate($event) {
    this.properties = $event;
    this.content = this.properties.content;
  }

  setConfig($event) {
    this.properties.config = $event;
  }

}
