import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'name'
})
export class NamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return '';
    }

    if (value.profile) {
      value = value.profile;
    }

    if (typeof value === 'string') {
      const parts = value.replace('.', ' ').replace('-', ' ').replace('_', ' ').split(' ');

      let name = '';

      for (const part of parts) {
        if (name.indexOf(part) === -1) {
          name = `${name} ${part}`;
        }
      }

      value = name;
    } else if (value.firstName || value.name) {

      let name = value.firstName || value.name;
      if (value.lastName && value.firstName.indexOf(value.lastName) === -1) {
        name = `${name} ${value.lastName}`;
      }
      value = name;
    } else if (value.length) {
      let name = '';
      value.forEach((element) => {
        name = `${element.name}|${name}`;
      });

      value = name.substr(0, name.length - 1);
    } else if (typeof value !== 'string') {
      return ''
    }

    return value ? value.replace('.', ' ').replace('-', ' ').replace('_', ' ').trim().toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase()) : '';
  }

}
