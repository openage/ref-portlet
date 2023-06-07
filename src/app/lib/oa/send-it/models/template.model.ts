import { ModelBase } from '../../core/models/model-base.model';
import { Level } from '../enums/level.enum';
import { TemplateAction } from './template-action.model';
import { TemplateConfig } from './template-config.model';
import { TemplateDataSource } from './template-data-source.model';

export class Template extends ModelBase {
  name: string;
  subject: string;
  body: string;
  level: Level;
  attachment: Template;
  type: string;
  logo: string; // logo of tenant or organization
  dp: string; // display picture of user
  isHidden: boolean; // For hidden operations
  category: string;
  isSubscribed: boolean; // For default subscription
  layout: Template
  config: TemplateConfig;

  summary: string;

  dataSource: TemplateDataSource;

  actions: TemplateAction[];

  from: {
    email: string;
  };

  isSelectedEmailTemplate: boolean;

  constructor(obj?: any) {
    super();

    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.status = obj.status;
    this.timeStamp = obj.timeStamp;
    this.isSelectedEmailTemplate = obj.isSelectedEmailTemplate || true;

    this.name = obj.name;
    this.body = obj.body;
    this.subject = obj.subject;
    this.level = obj.level;
    this.summary = obj.summary;
    this.from = obj.from;
    this.type = obj.type;
    this.category = obj.category;
    this.config = new TemplateConfig(obj.config || {});

    this.isHidden = obj.isHidden;
    this.isSubscribed = obj.isSubscribed;

    if (obj.dataSource) {
      this.dataSource = new TemplateDataSource(obj.dataSource);
    }

    this.layout = new Template(obj.layout);
    this.actions = obj.actions
  }
}
