import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberService {

  constructor() { }

  decimalCalculator(value, decimal) {
    if (!value) { return 0; }

    const tempValue = value.toString().split('.');
    value = tempValue[0];

    if (tempValue[1]) {
      let temp = tempValue[1].slice(0, decimal);
      if (temp.length < decimal) {
        for (let i = 0; i < decimal - temp.length; i++) {
          temp = temp.concat('0');
        }
      }
      value = [value, temp].join('.');
    }
    return value;
  }
}
