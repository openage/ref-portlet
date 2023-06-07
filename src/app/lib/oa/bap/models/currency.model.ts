import { ModelBase } from '../../core/models/model-base.model';

export class Currency extends ModelBase {
   name: string;
   code: string;

   symbol: string;
   status: string;

    constructor(obj?: any) {
        super(obj);
        if (!obj) {
            return;
        }

        this.name = obj.name;
        this.code = obj.code;
        this.symbol = obj.symbol;
        this.status = obj.status;
    }

}
