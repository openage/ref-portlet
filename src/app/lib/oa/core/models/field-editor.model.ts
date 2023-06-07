import { FieldModel } from "./field.model";

export class FieldEditorModel extends FieldModel {
  group?: any;
  control?: any;

  required?: boolean;
  validations?: any[];
  sequence: number;

  constructor(obj?: any) {
    super(obj);

    this.required = obj.required;
    this.validations = obj.validations;

    this.group = obj.group || {};
    if (obj.groupKey) {
      this.group = {
        name: obj.group,
        key: obj.groupKey
      };
    }

    this.control = obj.control;
    this.sequence = obj.sequence;


    if (obj.options) {
      this.config.options = obj.options;
    }
  }

}
