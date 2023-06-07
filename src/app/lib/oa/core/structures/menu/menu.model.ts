import { Action } from './action.model';

export class Menu {
    items: Action[];

    constructor(obj: any[]) {
        if (!obj) { return; }
        this.items = [];
        obj.forEach((item) => {
            if (item instanceof Action) {
                this.items.push(item);
            } else {
                this.items.push(new Action(item));
            }
        });
    }
}
