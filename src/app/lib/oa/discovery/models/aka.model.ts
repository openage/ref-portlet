import { ModelBase } from '../../core/models';

export class Aka extends ModelBase {
    code: string
    template: string
    summary: string
    title: string
    view: string
    content: {
        body: string,  //<div>Body</div>
        url: string
    }
    status: string
    meta: any
    url: string

    constructor(obj?: any) {
        super(obj);
        if (!obj) {
            return;
        }

        this.code = obj.code
        this.template = obj.template
        this.summary = obj.summary
        this.title = obj.title
        this.view = obj.view
        this.content = obj.content
        this.status = obj.status
        this.meta = obj.meta
        this.url = obj.url
    }

}
