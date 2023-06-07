import { ModelBase } from '../../core/models'

export class Tax extends ModelBase {
     type: string;
     description: string;

    constructor(obj?: any) {
        super(obj);
        if (!obj) {
            return;
        }

        this.id = obj.id;
        this.code = obj.code;
        this.name = obj.name;
        this.description = obj.description;
        this.type = obj.type;
      
    }

}
