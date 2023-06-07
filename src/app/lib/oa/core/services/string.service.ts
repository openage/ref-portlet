import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StringService {

  constructor() { }

  inject(str: string, data: object) {
    const template = str;

    function getValue(obj, is, value?) {
      if (typeof is === 'string') {
        is = is.split('.');
      }
      if (is.length === 1 && value !== undefined) {
        // eslint-disable-next-line no-return-assign
        return obj[is[0]] = value;
      } else if (is.length === 0) {
        return obj;
      } else {
        const prop = is.shift();
        // Forge a path of nested objects if there is a value to set
        if (value !== undefined && obj[prop] === undefined) { obj[prop] = {}; }
        return getValue(obj[prop], is, value);
      }
    }

    return template.replace(/\$\{(.+?)\}/g, (match, p1) => getValue(data, p1));
  }

  setValue(str, value, model) { // str: [], value: need to set, model: properties
    const data = model;
    const place: any[] = str.split('.');
    let count = 0;

    function sValue(data, is, objValue) {
      count++;
      data[is] = objValue || {};
      if (count === place.length) {
        data[is] = value;
        return;
      } else {
        return sValue(data[is], place[count], data[is][place[count]]);
      }
    }

    sValue(data, place[0], data[place[0]]);

    return data;
  }

  inflate(flattened) {
    const model = {}

    Object.getOwnPropertyNames(flattened).forEach(key => {
      const value = flattened[key]

      if (!value) {
        return
      }

      const parts = key.split('-')
      let index = 0
      let obj = model

      for (const part of parts) {
        if (index === parts.length - 1) {
          obj[part] = value
        } else {
          obj[part] = obj[part] || {}
        }

        obj = obj[part]
        index++
      }
    })

    return model
  }

}
