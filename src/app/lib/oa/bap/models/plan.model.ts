import { ModelBase } from '../../core/models/model-base.model';
import { Currency } from './currency.model';

export class Plan extends ModelBase {
    name: string;
    code: string;

    amount: {
        max: number;
        min: number;
    };

    type: string;
    duration: number;
    interval: string;

    status: string;

    meta: any;

    currency: Currency;

    constructor(obj?: any) {
        super(obj);
        if (!obj) {
            return;
        }

        this.type = obj.type;

        this.duration = obj.duration;
        this.interval = obj.interval;

        this.meta = obj.meta;

        if (obj.amount) {
            this.amount = {
                max: obj.amount.max || 0,
                min: obj.amount.min || 0,
            };
        }

        if (obj.currency) {
            this.currency = new Currency(obj.currency);
        }

    }

}
