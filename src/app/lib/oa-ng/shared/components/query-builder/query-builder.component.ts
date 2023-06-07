import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RoleService, StringService } from 'src/app/lib/oa/core/services';
import { ReportParam } from 'src/app/lib/oa/insight/models';

import * as moment from 'moment';
import { UxService } from 'src/app/core/services';
import { FieldEditorModel } from 'src/app/lib/oa/core/models';

declare var $: any;

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit, OnChanges {
  @Input()
  view = 'form';

  @Input()
  filters: any[] = [];

  @Input()
  options: {
    labels?: {
      apply?: string
    },
    hideSearch?: boolean
  };

  @Output()
  apply: EventEmitter<any> = new EventEmitter();

  @Output()
  reset: EventEmitter<any> = new EventEmitter();

  mainFilters: FieldEditorModel[];
  otherFilters: FieldEditorModel[];
  allFilters: FieldEditorModel[];

  values: ReportParam[] = [];

  isReset = false;
  showMore = false;

  constructor(
    public auth: RoleService,
    public uxService: UxService,
    private stringService: StringService
  ) { }

  ngOnInit() {
    this.extract();
    // if (this.view === 'inline') {
    //   this.onApply()
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.extract();
  }

  onDateSelect(filter: FieldEditorModel, $event: Date) {
    this.addValue(filter, $event, moment($event).format(filter.config.format || 'DD-MM-YYYY'));

    if (this.view === 'inline') {
      this.onApply()
    }
  }

  onTextChange(filter: FieldEditorModel, $event) {
    const text = this.uxService.getTextFromEvent($event, { placeholder: filter.config.placeholder });
    this.addValue(filter, text, text);

    if (this.view === 'inline') {
      this.onApply()
    }
  }

  onSelectChange(filter: FieldEditorModel, $event) {
    if ($event) {
      this.addValue(filter, $event.value, $event.label);
    } else {
      this.removeValue(filter);
    }

    if (this.view === 'inline') {
      this.onApply()
    }
  }

  onReset() {
    this.isReset = true;
    this.values = [];
    this.allFilters.forEach((i) => {
      if (i.value && i.value.default) {
        this.addValue(i, i.value.default, i.value.label);
      }
    });

    this.reset.emit();
    const this_new = this;
    setTimeout(() => {
      this_new.isReset = !this_new.isReset;
    }, 100);
  }

  extract() {
    this.options = this.options || {};
    this.options.labels = this.options.labels || {};
    this.options.labels.apply = this.options.labels.apply || 'Apply';

    this.mainFilters = [];
    this.otherFilters = [];
    this.allFilters = [];
    this.values = [];
    (this.filters || []).forEach((i) => {
      const queryItem = new FieldEditorModel(i);
      if (!queryItem.config.group || queryItem.config.group === 'main') {
        this.mainFilters.push(queryItem);
      } else {
        this.otherFilters.push(queryItem);
      }

      if (queryItem.value && queryItem.value.default) {
        this.addValue(queryItem, queryItem.value.default, queryItem.value.label);
      }
      this.allFilters.push(queryItem);
    });
  }

  onApply() {
    this.addContextFilter();
    for (const item of this.mainFilters) {
      if (item.config.required && !this.values.find((i) => i.key === item.key)) {
        this.uxService.handleError(item.config.required || 'Missing required fields');
        return;
      }
    }
    this.apply.emit(this.values);
  }

  addContextFilter() {
    const data = {};
    data['user'] = this.auth.currentUser();
    data['role'] = this.auth.currentRole();
    data['organization'] = this.auth.currentOrganization();
    data['tenant'] = this.auth.currentTenant();

    this.mainFilters.forEach((filter) => {
      if ((filter.control === 'context') && filter.config && filter.config.value) {
        this.addValue(filter, this.stringService.inject(filter.config.value, data), filter.label);
      }
    });
  }

  addValue(filter: FieldEditorModel, value: any, display: string) {
    if (!value) {
      this.removeValue(filter);
    }

    const item = this.values.find((i) => i.key === filter.key);
    if (item) {
      item.value = value;
      item.valueLabel = display;
    } else {
      this.values.push({
        label: filter.label,
        key: filter.key,
        value,
        valueLabel: display
      });
    }
  }

  removeValue(filter: FieldEditorModel) {
    this.values = this.values.filter((i) => i.key !== filter.key);
  }

  onAutoCompleteSelect(filter: FieldEditorModel, $event: any) {
    if ($event) {
      this.addValue(filter, $event[filter.config.valueKey || 'code'], $event.label);
    } else {
      this.removeValue(filter);
    }

    if (this.view === 'inline') {
      this.onApply()
    }
  }
}
