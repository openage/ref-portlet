import { ModelBase } from '../../core/models/model-base.model';
import { State } from './state.model';

export class Workflow extends ModelBase {
  selectedState: State;
  icon: any;
  states: State[] = [];
  children: Workflow[] = [];
  description: string;
  hooks: {
    trigger: {
      when: string, // values - before, after(default),
      entity: string,
      action: string
    },
    actions: [{
      code: string,
      handler: string, // values - frontend, backend (default)
      type: string, // http
      config: any // { "url": ":drive/docs/idcard/${data.code}", "action": "GET", "headers": {"x-role-key": "${context.role.key}" }
    }]
  }[] = [];
  templates?: {
    creator?: any,
    viewer?: any,
    editor?: {
      meta?: {
        label: string,
        style: any,
        fields: [{
          identity: boolean,
          key: any, // the db key.
          label: any,
          placeholder: string,
          defaultValue: string,
          icon: string,
          description: string,
          formula: string,
          template: string, // this would be a template string which we want to render as a template on UI with some associated actions.
          isHidden: boolean,
          type: string, // string, number, date, object
          format: String,
          control: String, //input, textArea, date, time, dropdown, autocomplete, stringArray, table, Object----editor
          permissions: [String],
          validations: [{
            code: String, // validator fn
            message: String
          }],
          style: Object, // a JSON object that would be used by widget to style the value
          config: Object
        }]
      }
      attributes?:string[]
    }
  }
  notifications: {
    statusChanged?: string,
    assigned?: string,
    updated?: string
  };
  roles: {
    code: string,
    name: string,
    permissions: string[]
  }[]

  constructor(obj?: any) {
    super(obj);
    if (!obj) { return; }

    const stateMap: any = {};
    this.icon = obj.icon;

    (obj.states || []).forEach((s) => {
      stateMap[s.code] = new State(s);
    });

    this.states = (obj.states || []).map((s) => {
      const state = stateMap[s.code];

      if (s.next && s.next.length) {
        state.next = [];
        s.next.forEach((n) => state.next.push(stateMap[n.code || n]));
      }
      return state;
    });

    this.children = (obj.children || []).map((w) => new Workflow({
      code: w.code,
      name: w.name
    }));
    this.meta = obj.meta;
    this.description = obj.description;
    this.hooks = obj.hooks || [];
    this.templates = obj.templates
    this.notifications = obj.notifications ? obj.notifications : {}
    this.roles = obj.roles || [];
  }
}
