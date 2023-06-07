import { Pipe, PipeTransform } from '@angular/core';
import { NumberService } from '../services/number.service';

@Pipe({
  name: 'value'
})
export class NumberPipe implements PipeTransform {
  constructor(public numberService: NumberService) {

  }

  toWord(value: any) {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    function convert(num) {
      if ((num = num.toString()).length > 9) { return 'overflow'; }
      const n: any = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) { return; } let str = '';
      str += (n[1] !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
      str += (n[2] !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
      str += (n[3] !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
      str += (n[4] !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
      str += (n[5] !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
      return str;
    }

    return convert(value);
  }

  toComma(value: any) {
    return Number(value).toLocaleString('en-IN');
  }

  toShort(value: any): any {
    if (!value || isNaN(value)) { return '0'; }

    const abs = Math.abs(value);

    const powers = [
      { key: '', min: 1, max: 1000 },
      { key: ' K', min: 1000, max: Math.pow(10, 5) },
      { key: ' L', min: Math.pow(10, 5), max: Math.pow(10, 7) },
      { key: ' Cr', min: Math.pow(10, 7), max: Math.pow(10, 12) },
      { key: ' T', min: Math.pow(10, 12), max: Math.pow(10, 15) },
    ];

    const power = powers.find((i) => abs >= i.min && abs < i.max);
    let key = '';
    if (power) {
      value = value / power.min;
      key = power.key;
    }

    let stringified = `${Math.ceil(Math.abs(value) * 1000) / 1000}`;
    const indexOfDot = stringified.indexOf('.');
    if (indexOfDot !== -1) {
      const decimals = stringified.length - indexOfDot - 1;
      const integers = stringified.length - decimals - 1;

      if (integers >= 3) {
        stringified = stringified.substring(0, integers);
      } else if (integers >= 2) {
        stringified = stringified.substring(0, integers + 1 + (decimals > 1 ? 1 : decimals));
      } else if (integers >= 1) {
        stringified = stringified.substring(0, integers + 1 + (decimals > 2 ? 2 : decimals));
      }
    }

    return `${(value < 0 ? '-' : '')}${stringified}${key}`;
  }

  roundOff(value) {
    return value.toFixed(2);
  }

  integer(value) {
    return value = Math.floor(value);
  }

  currency(value) {
    return Number(`${this.numberService.decimalCalculator(value, 2)}`).toLocaleString('en-IN');
  }

  transform(value: any, args?: any): any {

    if (isNaN(value)) {
      return value;
    }

    if (!args) {
      args = 'comma';
    }

    switch (args) {
      case 'comma':
        return this.toComma(value);

      case 'words':
        return this.toWord(value);

      case 'short':
        return this.toShort(value);

      case 'roundOff':
        return this.roundOff(value);

      case 'integer':
        return this.integer(value);

      case 'currency':
        return this.currency(value);
    }

  }

}
