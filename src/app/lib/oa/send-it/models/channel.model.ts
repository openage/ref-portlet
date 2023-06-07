import { ModelBase } from '../../core/models/model-base.model';
import { Provider } from './provider.model';

export class Channel extends ModelBase {
    provider: Provider;
    config: any;

    constructor(obj?: any) {
        super();

        if (!obj) {
            return;
        }

        this.id = obj.id;
        this.status = obj.status;
        this.timeStamp = obj.timeStamp;

        this.config = obj.config;
        this.provider = new Provider(obj.provider);
    }
}
