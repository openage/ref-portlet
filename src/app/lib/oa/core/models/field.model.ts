export class FieldModel {
  key: string;
  type?: string;
  code: string;

  label?: string;
  showLabel?: boolean = true;
  description?: string;
  icon?: string;
  placeholder?: string;
  style?: any;
  class?: string;

  permissions?: any[];

  value?: any | {
    value?: any,
    default?: any,
    key?: string,
    label?: string
  };

  readonly?: boolean;
  template?: string;
  format?: string;
  isHidden?: boolean;
  isSelected?: boolean;

  config?: any = {};

  constructor(obj?: any) {
    if (!obj) { return; }
    this.key = obj.key || obj.code || obj;
    this.code = obj.code || this.key;
    this.type = obj.type;

    this.label = obj.label || obj.name;
    if (obj.showLabel !== undefined) {
      this.showLabel = obj.showLabel;
    }

    this.description = obj.description || obj.message;
    this.icon = obj.icon;
    this.placeholder = obj.placeholder;

    this.style = obj.style || {};
    this.class = obj.class;
    this.style.label = this.style.label || {};
    this.style.value = this.style.value || {};

    this.permissions = obj.permissions;

    if (obj.value) {
      if (obj.value.valueKey || obj.valueLabel) {
        this.value = obj.value;
      } else {
        this.value = {
          value: obj.value,
          default: obj.value,
          key: obj.valueKey,
          label: obj.valueLabel
        };
      }
    } else {
      this.value = {
        key: obj.valueKey,
        label: obj.valueLabel
      };
    }

    this.readonly = obj.readonly;
    this.template = obj.template;
    this.format = obj.format;
    this.isHidden = obj.isHidden;
    this.isSelected = obj.isSelected || false;

    this.config = obj.config || {};
    this.config.style = this.config.style || this.style;
    this.config.class = this.config.class || this.class;
  }
}



