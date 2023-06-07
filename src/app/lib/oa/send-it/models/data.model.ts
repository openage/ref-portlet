import { Body } from './body.model';

export class Data {

    id: string;
    url: string;
    data: any;
    body: Body;

    constructor(obj?: any) {
        if (!obj) { return; }

        this.id = obj.id;
        this.url = obj.url;
        this.data = obj.data;
    }
}
