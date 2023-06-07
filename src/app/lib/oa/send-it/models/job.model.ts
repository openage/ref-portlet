import { ModelBase } from '../../core/models/model-base.model';
import { TemplateConfig } from './template-config.model';
import { TemplateDataSource } from './template-data-source.model';
import { Template } from './template.model';

export class Job extends ModelBase {
  name: string;
  processor: string;
  config: TemplateConfig;
  template: Template;
  dataSource: TemplateDataSource;

  constructor(obj?: any) {
    super();

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
    this.processor = obj.processor;

    this.config = new TemplateConfig(obj.config || {});

    if (obj.template) {
      this.template = new Template(obj.template);
    }

    if (obj.dataSource) {
      this.dataSource = new TemplateDataSource(obj.dataSource);
    }

    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
  }
}
