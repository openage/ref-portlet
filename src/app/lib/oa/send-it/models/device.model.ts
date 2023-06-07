import { ModelBase } from '../../core/models/model-base.model';

export class Device {
    id: string;

    constructor(obj?: any) {

        if (!obj) {
            return;
        }

        this.id = obj.id;
    }
}
