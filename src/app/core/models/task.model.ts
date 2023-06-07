export class Task {
    id: string;
    code?: string;
    name: string;
    type?: string; // upload | download
    icon: string;
    status: string;
    progress: number;
    api: {
        code: string;
        service: string;
    }
    redirect?: {
        type?: string;
        url: string;
    }
    url?: string
    constructor(obj?: any) {
        if (!obj) {
            return;
        }

        this.id = obj.id;
        this.code = obj.code;
        this.type = obj.type;
        this.name = obj.name;
        this.icon = obj.icon;
        this.status = obj.status;
        this.progress = obj.progress || 0;
        this.api = obj.api;
        this.redirect = obj.redirect || {};
        this.url = obj.url;
    }
}
