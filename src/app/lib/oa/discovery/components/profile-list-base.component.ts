import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Directive } from '@angular/core';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Profile } from '../models/profile.model';
import { ProfileService } from '../services';

@Directive()
export class ProfileListBaseComponent extends PagerBaseComponent<Profile> implements OnInit, OnDestroy, OnChanges {

    @Input()
    readonly = false;

    @Input()
    status: string;

    @Input()
    name: string;

    @Input()
    code: string;

    @Input()
    sort = 'code';

    @Input()
    entity: any;

    @Input()
    view: 'marquee' | 'table' | 'list' = 'marquee';

    constructor(
        api: ProfileService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: { limit: 10 },
            filters: ['name', 'status', 'code', 'entity-id', 'entity-type', 'entity-provider'],
        });
    }

    ngOnInit() {
        // this.fetch();
    }

    ngOnChanges(): void {
        // this.filters.set('status', this.status);
        this.filters.set('name', this.name);
        this.filters.set('code', this.code);
        if (this.entity) {
            this.filters.set('entity-id', this.entity.id);
            this.filters.set('entity-type', this.entity.type);
            this.filters.set('entity-provider', this.entity.provider);
        }
        this.fetch();
    }

    ngOnDestroy(): void {
    }
}
