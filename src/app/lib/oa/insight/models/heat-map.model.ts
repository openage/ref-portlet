import { ModelBase } from '../../core/models/model-base.model';

export class HeatMapEvent extends ModelBase {
    label: string;
    date: Date;

    constructor(obj?: any) {
        super();
        if (!obj) { }
        this.id = obj.id;
        this.label = obj.label;
        this.date = obj.date;
    }
}
