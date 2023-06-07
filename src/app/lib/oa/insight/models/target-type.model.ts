import { ModelBase } from '../../core/models/model-base.model';

export class TargetType extends ModelBase {
    label: string;
    unit: string;
    period: string;
    config: {
        create: {
            auto: boolean,
            value: Number,
            distributed: string
        }
    };

    constructor(obj?: any) {
        super(obj);
        if (!obj) { return; }
        this.label = obj.label;
        this.unit = obj.unit;
        this.period = obj.period;
        this.config = this.config;
    }
}
