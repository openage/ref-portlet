import { FieldEditorModel } from '../../core/models';
import { ModelBase } from '../../core/models/model-base.model';
import { Action } from '../../core/structures';
import { ReportArea } from './report-area.model';
import { ReportColumn } from './report-column.model';
import { ReportParam } from './report-param.model';
import { Widget } from './widget.model';
export class ReportType extends ModelBase {
  name: string;
  icon?: string;
  description?: string;
  view?: string;
  area: ReportArea;
  config: any;
  graph: any;
  container: {
    code?: string
    style?: {}
    class?: {},
    gridStyle?: {
      mainDiv?: any,
      valueDiv?: any,
      titleDive?: any
    }
  };
  widget: Widget;

  filters: FieldEditorModel[] = [];
  fields: ReportColumn[] = [];
  actions: Action[] = [];

  status: string;
  download: {
    csv?: any;
    excel?: any;
    pdf?: any
  };
  provider: string;
  permissions?: string[];

  constructor(obj?: any) {
    super();
    if (!obj) {
      return;
    }
    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
    this.description = obj.description;
    this.view = obj.view;
    this.graph = obj.graph;
    this.config = obj.config;
    this.icon = obj.icon;
    this.container = obj.container;
    this.widget = new Widget(obj.widget || {});
    this.permissions = obj.permissions;
    this.status = obj.status;
    this.download = obj.download || {};

    if (obj.fields) {
      this.fields = obj.fields.map((column) => new ReportColumn(column));
    }

    if (obj.filters) {
      this.filters = obj.filters.map((filter) => new ReportParam(filter));
    }

    if (obj.actions) {
      this.actions = obj.actions.map((action) => new Action(action));
    }
  }
}
