import { Location } from '@angular/common';

import * as moment from 'moment';

import { Filter } from './filter.model';
import { FiltersOptions } from './filters-options.model';
import { IFilters } from './filters.interface';

export class Filters implements IFilters {

  items: Filter[] = [];
  properties = {};

  location: Location;

  constructor(private options: FiltersOptions) {
    if (options.filters) {
      options.filters.forEach((item) => {
        const model = new Filter(item, this);
        this.items.push(model);
        this.properties[model.field] = model;
      });
    }
    this.location = options.location;
  }

  apply() {
    return this.options.associatedList.fetch();
  }

  reset(apply = true) {
    this.items.forEach((item) => {
      item.reset(false);
    });
    if (apply) {
      return this.apply();
    }
  }

  get(field: string): Filter {
    return this.properties[field];
  }

  set(field: string, value: any, apply = false, addOperator = false) {
    const item = this.properties[field];

    if (!item) {
      return;
    }

    if (value) {
      value = (value instanceof Date) ? moment(value).toISOString() : value;
      if (Array.isArray(value)) {
        value = value.map(s => s.id || s.code || s).join(',');
      } else {
        value = value.id || value.code || value;
      }
    }

    item.value = value;
    item.addOperator = addOperator;
    if (apply) {
      return this.apply();
    }
  }

  setQuery(query: any, apply = true) {
    query = query || {};
    this.reset(false);
    this.items.forEach((i) => {
      if (query[i.field]) {
        this.set(i.field, query[i.field]);
      }
    });

    if (apply) {
      return this.apply();
    }
  }

  getQuery() {
    const query = {};

    const urlSearchParams = this.location ? (new URLSearchParams(this.location.path().split('?')[1])) : null;

    let count = 0;

    this.items.forEach((item) => {

      const value = (item.value instanceof Date) ? moment(item.value).toJSON() : item.value;

      const key = item.field;

      if (urlSearchParams && !item.skipUrl) {
        urlSearchParams.set(item.field, item.isEmpty() ? null : value);
      }

      if ((item.value !== undefined || item.value !== null) && item.value !== '' && item.value !== 0) {
        if (this.options.addOperator && item.field && item.addOperator) {
          query[`f[${count}][f]`] = item.field;
          query[`f[${count}][o]`] = item.operator || 'eq';
          query[`f[${count}][v]`] = item.value;
        } else {
          query[item.field] = item.value;
        }
        count++;
      }
    });

    if (urlSearchParams) {
      const url = this.location.path().split('?')[0];
      this.location.replaceState(url, urlSearchParams.toString());
    }

    return query;
  }
}
