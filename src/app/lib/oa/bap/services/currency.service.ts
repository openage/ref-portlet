import { Injectable } from '@angular/core';
import { Currency } from '../models/currency.model';

@Injectable()
export class CurrencyService {

  items: Currency[] = [];

  constructor() {

    this.items = [
      new Currency({ code: 'AED', name: 'AED' }),
      new Currency({ code: 'BHD', name: 'BHD' }),
      new Currency({ code: 'CHF', name: 'CHF' }),
      new Currency({ code: 'EUR', name: 'EUR' }),
      new Currency({ code: 'GBP', name: 'GBP' }),
      new Currency({ code: 'INR', name: 'INR' }),
      new Currency({ code: 'CNY', name: 'CNY' }),
      new Currency({ code: 'USD', name: 'USD' }),
      new Currency({ code: 'XOF', name: 'XOF' }),
      new Currency({ code: 'JPY', name: 'JPY' }),
      new Currency({ code: 'HDK', name: 'HDK' }),
      new Currency({ code: 'IDR', name: 'IDR' }),
      new Currency({ code: 'AUD', name: 'AUD' }),
      new Currency({ code: 'KWD', name: 'KWD' }),
      new Currency({ code: 'SAR', name: 'SAR' })
    ];
  }
}
