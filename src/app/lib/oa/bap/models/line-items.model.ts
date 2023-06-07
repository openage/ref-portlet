import { ModelBase } from '../../core/models/model-base.model';
import { Tax } from './tax.model';

export class LineItem extends ModelBase {
  description: string;
  sac: string;
  glNumber: string;

  taxes?: {
    amount: number,
    value: number,
    type: Tax
  }[];

  discount: any;

  units: number;
  rate: {
    amount: number,
    conversion: number,
    currency: string
  };

  taxAmount?: number; // total tax amount of lineItem
  taxableAmount: number; // total taxable amount of lineItem
  amount: number;  // total amount of lineItem with discount and taxes

  meta: any;

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }

    this.id = obj.id;
    this.code = obj.code;
    this.name = obj.name;
    this.sac = obj.sac;
    this.glNumber = obj.glNumber;
    this.description = obj.description;
    this.discount = obj.discount;
    this.units = obj.units;
    if (obj.rate) {
      this.rate = {
        amount: obj.rate.amount || 0,
        conversion: obj.rate.conversion || 0,
        currency: obj.rate.currency
      };
    }
    this.amount = obj.amount;
    this.taxAmount = obj.taxAmount;

    this.meta = obj.meta;
    if (obj.taxes?.length) {
      this.taxes = obj.taxes.map((item) => {
        return {
          value: item.value,
          amount: item.amount,
          type: new Tax(item.type)
        }
      })
    }
  }

}
