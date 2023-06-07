export class Change {
    field: string;
    value: string;
    oldValue: string;
    text: string;
    type?: string;

    constructor(obj?: any) {
        if (!obj) return;
        this.field = obj.field;
        this.value = obj.value;
        this.oldValue = obj.oldValue;
        this.text = obj.text;
        this.type = obj.type;
    }
}
