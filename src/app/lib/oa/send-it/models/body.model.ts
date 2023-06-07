export class Body {

    status: string;
    permissions: string;

    constructor(obj?: any) {
        if (!obj) { return; }

        this.status = obj.status;
        this.permissions = obj.permissions;
    }
}
