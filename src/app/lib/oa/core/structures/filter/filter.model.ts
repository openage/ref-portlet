import { IPager } from '../pager/pager.interface';
import { IFilters } from './filters.interface';

export class Filter {
    control: {
        title: string,
        type: string,
        options: { title: string, icon: string, value: string }[]
    };
    field: string;
    value?: any;
    operator = 'eq';
    isSelected = false;
    skipUrl = false;
    addOperator = false;

    private originalValue: any;

    set(value, apply = false): Promise<IPager> {
        this.value = value;
        if (apply) {
            return this.filters.apply();
        }
    }

    toggle(value: any): Promise<IPager> {
        if (this.value === value) {
            this.value = this.originalValue;
        } else {
            this.value = value;
        }

        return this.filters.apply();
    }
    reset(apply = true): Promise<IPager> {
        this.value = this.originalValue;
        if (apply) {
            return this.filters.apply();
        }
    }

    go(): Promise<IPager> {
        return this.filters.apply();
    }

    constructor(param: any, private filters: IFilters) {
        if (!param) { return; }

        if (param.field) {
            this.field = param.field;
        } else {
            this.field = param;
        }

        if (param.value) {
            this.value = param.value;
        }

        if (param.operator) {
            this.operator = param.operator;
        }

        this.control = param.control;

        if (param.isSelected) {
            this.isSelected = param.isSelected;
        }

        if (param.skipUrl) {
            this.isSelected = param.skipUrl;
        }

        this.originalValue = this.value;
    }

    isEmpty = () => {

        if (!this.value) {
            return true;
        }
        if ((typeof this.value === 'number') && this.value === 0) {
            return true;
        }
        if ((typeof this.value === 'string') && (this.value === '0' || this.value === '' || this.value.match(/^ *$/) !== null)) {
            return true;
        }
        if (Array.isArray(this.value) && !this.value.length) {
            return true;
        }

        return false;
    }
}
