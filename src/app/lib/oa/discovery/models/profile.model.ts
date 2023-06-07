import { ModelBase } from '../../core/models';

export class Profile extends ModelBase {
    code: string
    pic: {
        url: string,
        thumbnail: string,
        status: string
    }
    images: [{
        url: string,
        thumbnail: string
    }]
    name: string
    description: string
    reactions: {
        like: Number,
        love: Number
    }
    price: Number
    entity: {
        id: string, // can be url in case of campaign
        provider: string, // rbc, directory
        type: string
    }
    tags: [string]
    status: string
    location: {
        coordinates: {
            type: string,
            coordinates:
            [Number]
        },
        name: string,
        description: string,
        line1: string,
        line2: string,
        district: string,
        city: string,
        state: string,
        pinCode: string,
        country: string
    }
    startTime: Date
    endTime: Date
    meta: any
    isUnCreated = false

    constructor(obj?: any) {
        super(obj);
        if (!obj) {
            return;
        }

        this.code = obj.code
        this.name = obj.name;
        this.description = obj.description;

        if(!this.code) {
            this.isUnCreated = true
        }

    }

}
