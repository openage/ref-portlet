
import { ModelBase } from '../../core/models/model-base.model';
import { ConfigParam } from './config-param.model';

export class Provider extends ModelBase {
    name: string;
    category: string;
    url: string;
    description: string;
    discoverable: true;
    picUrl: string;

    parameters: ConfigParam[] = [];

    constructor(obj?: any) {
        super();

        if (!obj) {
            return;
        }

        this.id = obj.id;
        this.code = obj.code;
        this.category = obj.category;
        this.name = obj.name;
        this.status = obj.status;
        this.timeStamp = obj.timeStamp;

        this.url = obj.url;
        this.description = obj.description;
        this.picUrl = obj.picUrl;

        if (obj.parameters) {
            obj.parameters.forEach((parameter) => {
                this.parameters.push(new ConfigParam(parameter));
            });
        }
    }
}
