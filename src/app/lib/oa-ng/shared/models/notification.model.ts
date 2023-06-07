export class PushNotification {
    body ? : string;
    icon ? : string;
    tag ? : string;
    data ? : any;
    renotify ? : boolean;
    silent ? : boolean;
    sound ? : string;
    noscreen ? : boolean;
    sticky ? : boolean;
    dir ? : 'auto' | 'ltr' | 'rtl';
    lang ? : string;
    vibrate ? : number[];

    constructor(obj?: any) {
        obj = obj || {};
        this.body = obj.body;
        this.icon = obj.icon;
        this.tag = obj.tag;
        this.data = obj.data;
        this.renotify = obj.renotify;
        this.silent = obj.silent;
        this.sound = obj.sound;
        this.noscreen = obj.noscreen;
        this.sticky = obj.sticky;
        this.dir = obj.dir;
        this.lang = obj.lang;
        this.vibrate = obj.vibrate;
    }
}