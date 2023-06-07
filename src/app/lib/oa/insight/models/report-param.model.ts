export class ReportParam {
  key: string;
  dbKey?: string;
  type?: string;
  label?: string;

  required?: boolean;
  value?: any;
  valueKey?: string;
  valueLabel?: string;
  message?: string;
  group?: string;
  groupKey?: string;
  options?: [{
    label?: string
    value?: string
  }];
  control?: string;
  validations?: string[];
  config?: any;
  range?: {
    from?: {
      value?: any,
      valueLabel?: string
    },
    till?: {
      value?: any,
      valueLabel?: string
    }
  };
  dbCondition?: string;

  purpose?: string;
  style?: any;
  isHidden?: boolean;
  permissions?: any[];
  placeholder?: string;
  showLabel?: boolean;

  constructor(obj?: any) {

    if (!obj) { return; }

    this.key = obj.key;
    this.label = obj.label;
    this.control = obj.control;
    this.required = obj.required;
    this.value = obj.value;
    this.valueKey = obj.valueKey;
    this.valueLabel = obj.valueLabel;
    this.message = obj.message;
    this.group = obj.group;
    this.groupKey = obj.groupKey;
    this.config = obj.config;
    this.options = obj.options;
    this.type = obj.type;
    this.purpose = obj.purpose || 'match';
    this.dbCondition = obj.dbCondition;
    this.style = obj.style || {};
    this.range = obj.range || { from: {}, till: {} };
    this.isHidden = obj.isHidden;
    this.permissions = obj.permissions;
    this.placeholder = obj.placeholder;
    this.showLabel = obj.showLabel;
  }
}
