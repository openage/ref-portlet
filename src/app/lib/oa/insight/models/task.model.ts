import { ModelBase } from '../../core/models';

export class Task extends ModelBase {
    date: Date;

    config: any;
    data: any;

    progress: number;
    error: any;

    handler: string;
    status: string;

    constructor(obj?: any) {
        super(obj);
        if (!obj) { return; }

        this.date = obj.date;
        this.config = obj.config;
        this.data = obj.data;
        this.progress = obj.progress;
        this.error = obj.error;
        this.handler = obj.handler;
        this.status = obj.status;
    }
}
