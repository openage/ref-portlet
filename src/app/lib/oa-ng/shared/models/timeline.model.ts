export class Timeline {
    code?: string;
    type: string;
    location: string;
    event?: string[];
    formattedEventStr?: string;
    actualTime?: string;
    expectedTime: string;
    timeStamp?: string;

    constructor(obj?: any) {
        obj = obj || {};

        this.code = obj.code;
        this.type = obj.type;
        this.location = obj.location;
        this.event = obj.event || [];
        this.formattedEventStr = obj.formattedEventStr || '';
        this.actualTime = obj.actualTime || null;
        this.expectedTime = obj.expectedTime || null;
        this.timeStamp = obj.timeStamp || null;
    }
}
