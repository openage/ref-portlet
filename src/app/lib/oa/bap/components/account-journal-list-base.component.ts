import { ErrorHandler, Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { PagerBaseComponent } from '../../core/structures';
import { Journal } from '../models/journal.model';
import { JournalService } from '../services/journal.service';

@Directive()
export class AccountJournalListBaseComponent extends PagerBaseComponent<Journal> implements OnInit, OnChanges {

    @Input() account: string;

    @Input() type: string;

    @Input() organization: string;

    @Input() selectedJournal: Journal;

    @Input() columns: string[] = ['date', 'amount', 'type', 'before', 'after', 'remarks'];

    constructor(
        api: JournalService,
        errorHandler: ErrorHandler
    ) {
        super({
            api,
            errorHandler,
            pageOptions: {
                limit: 10
            },
            filters: ['organization-code', 'type', 'status', 'account-code']
        });
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.filters.reset(false);
        this.search();
    }

    search(): void {
        if (this.type) {
            this.filters.set('type', this.type);
        }

        if (this.account) {
            this.filters.set('account-code', this.account);
        }

        if (this.organization) {
            this.filters.set('organization-code', this.organization);
        }

        this.fetch();
    }

}
