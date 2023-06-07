import { Location } from '@angular/common';
import { IPager } from '../pager/pager.interface';

export class FiltersOptions {
    associatedList: IPager;
    location?: Location;
    filters: any[];
    addOperator?: boolean;
}
