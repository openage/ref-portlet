import { TemplateRef } from "@angular/core";

export class InputOptions {
  required?: string;
  disabled = false;
  label?: string;
  min: number;
  trigger?: 'any' | 'finish';
  inline?: boolean;
  multiline?: boolean;
  placeholder?: string;
  changed: 'keep' | 'reset'; // reset will clear the input
  keys: {
    cancel?: string,
    finish?: string
  };

  format?: {
    casing?: string,
    trim?: boolean,
  }

  displayFn?: (value: any) => string;
  templates?: {
    value?: TemplateRef<any>,
    placeholder?: TemplateRef<any>,
    item?: TemplateRef<any>
  };

  constructor(obj?: any) {
    obj = obj || {};

    this.label = obj.label;
    this.required = obj.required;
    this.disabled = obj.disabled;

    this.min = obj.min || 0;
    this.inline = obj.inline || false;
    this.multiline = obj.multiline || false;
    this.placeholder = obj.placeholder || '';

    if (this.inline && !this.placeholder) {
      this.placeholder = this.label || '';

    }

    this.format = obj.format || {};
    this.format.casing = this.format.casing || 'none';
    this.format.trim = this.format.trim || true;

    this.trigger = obj.trigger || 'any';
    this.changed = obj.changed || 'keep';
    this.keys = obj.keys || {};
    this.keys.cancel = this.keys.cancel || 'Escape';
    this.keys.finish = this.keys.finish || 'Enter';

    this.displayFn = obj.displayFn;
    if (!this.displayFn) {
      this.displayFn = (value) => {
        if (!value) {
          return '';
        }
        return value.title || value.label || value.name || value;
      };
    }

    this.templates = obj.templates || {};
    this.templates.item = this.templates.item || this.templates.value;

  }
}
