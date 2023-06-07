export class ConfigParam {

    name: string;
    title: string;
    type: string;
    placeholder: string;
    description: string;
    validators: string[] = [];
    options: any[] = [];

    constructor(obj?: any) {

        if (!obj) {
            return;
        }

        this.name = obj.name;
        this.title = obj.title;
        this.type = obj.type;
        this.description = obj.description;
        this.validators = obj.validators;
        this.options = obj.options;
    }
}
