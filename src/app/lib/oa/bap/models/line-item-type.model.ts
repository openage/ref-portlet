import { ModelBase } from '../../core/models/model-base.model';
import { Tax } from './tax.model'

export class LineItemType extends ModelBase {
    description: string;
    exempted: string;
    condition: any;

    taxes: [{
        value: number;
        type: Tax;
    }];

    remarks: string;
    documentType: string;

    meta: any;

    constructor(obj?: any) {
        super(obj);
        if (!obj) {
            return;
        }

        this.id = obj.id;
        this.code = obj.code;
        this.name = obj.name;
        this.description = obj.description;

        this.exempted = obj.exempted;

        if (obj.taxes?.length) {
            this.taxes = obj.taxes.map((tax) => {
                return {
                    value: tax.value,
                    tax: new Tax(tax)
                }
            })
        }

        this.documentType = obj.documentType;
        this.remarks = obj.remarks;
        this.status = obj.status;

        this.meta = obj.meta || {};
    }

}
