import { ModelBase } from '../../core/models/model-base.model';
import { TemplateAction } from './template-action.model';
import { TemplateConfig } from './template-config.model';
import { TemplateDataSource } from './template-data-source.model';

export class Template extends ModelBase {
  name: string;
  description: string;
  body: string;
  //   level: Level;
  attachment: Template;
  logo: string; // logo of tenant or organization
  dp: string; // display picture of user
  isHidden: boolean; // For hidden operations
  category: string;
  subject: string;
  config: TemplateConfig;
  content: any;
  summary: string;
  dataSource: TemplateDataSource[] = [];
  actions: TemplateAction[];
  mimeTypes?: string[];
  hooks: any;
  visibility: number;
  mergeWithFiles: any;

  constructor(obj?: any) {
    super();

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
    this.subject = obj.subject;
    this.name = obj.name;
    this.body = obj.body;
    this.description = obj.description;
    // this.level = obj.level;
    this.summary = obj.summary;
    this.content = obj.content;
    this.mimeTypes = obj.mimeTypes;

    this.config = obj.config || {};
    this.hooks = obj.hooks;
    this.dataSource = (obj.dataSource || []).map((i) => new TemplateDataSource(i));
    this.visibility = obj.visibility;
    this.mergeWithFiles = obj.mergeWithFiles;
  }
}
