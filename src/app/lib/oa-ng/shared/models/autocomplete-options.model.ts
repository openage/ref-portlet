import { TemplateRef } from '@angular/core';
import { Action } from 'src/app/lib/oa/core/structures';
import { InputOptions } from './input-options.model';

export class AutoCompleteOptions {

  required?: string;
  label?: string;
  view?: {
    icon?: string,
    inline?: boolean,
    style?: any,
    class?: string
  };
  input?: InputOptions;
  search?: {
    field?: string,
    params?: any,
    limit?: number,
    items?: any[],
    skipSubjectStore?: boolean
  };
  add?: Action;
  preFetch?: boolean;
  autoSelect?: boolean;
  showDefaults?: boolean;
  prefixItem?: [];
  messages?: {
    noRecords?: string
  };
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
    this.messages = obj.messages || {};
    this.templates = obj.templates || {};
    this.view = obj.view || {};
    this.view.inline = this.view.inline || false;
    this.search = obj.search || {};

    this.preFetch = obj.preFetch;
    this.autoSelect = obj.autoSelect;
    this.showDefaults = obj.showDefaults;
    this.prefixItem = obj.prefixItem;
    this.displayFn = obj.displayFn;
    this.add = obj.add;

    if (obj.autoSelect === undefined) {
      this.autoSelect = false;
    }

    if (obj.showDefaults === undefined) {
      this.showDefaults = false;
    }

    this.templates.item = this.templates.item || this.templates.value;
    this.search.field = this.search.field || 'text';
    this.messages.noRecords = this.messages.noRecords || 'No Records Found';

    if (!this.displayFn) {
      this.displayFn = (value) => {
        if (!value) {
          return '';
        }

        if (typeof value !== 'object') {
          return value
        } else {
          return value.title || value.label || value.name || '';
        }
      };
    }

    this.input = new InputOptions(obj.input || {
      min: 3,
      trigger: 'any',
      changed: 'keep'
    });

    this.input.templates = this.input.templates || this.templates;
    this.input.displayFn = this.input.displayFn || this.displayFn;
  }
}
