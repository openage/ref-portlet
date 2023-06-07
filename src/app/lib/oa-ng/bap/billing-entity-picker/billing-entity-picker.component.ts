import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { BillingEntity } from 'src/app/lib/oa/bap/models/billing-entity.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { Organization } from 'src/app/lib/oa/bap/models/organization.model';
import { AutoCompleteOptions } from 'src/app/lib/oa-ng/shared/models/autocomplete-options.model';

@Component({
  selector: 'bap-billing-entity-picker',
  templateUrl: './billing-entity-picker.component.html',
  styleUrls: ['./billing-entity-picker.component.css']
})
export class BillingEntityPickerComponent implements OnInit, OnChanges {

  @Input()
  label: string;

  @Input()
  placeholder = 'Select Entity';

  @Input()
  readonly = false;

  @Input()
  skipSubjectStore = false;

  @Input()
  display: String = 'detail';

  @Input()
  disabled = false;

  @Input()
  value: BillingEntity;

  @Input()
  organization: Organization;

  @Output()
  changed: EventEmitter<BillingEntity> = new EventEmitter();

  autocompleteOptions: AutoCompleteOptions;

  constructor(
    public api: BillingEntityService,
    public errorHandler: UxService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    // this.value = this.value ? this.value : null;
    this.autocompleteOptions = new AutoCompleteOptions({
      label: this.label,
      placeholder: this.placeholder,
      search: {
        field: 'name',
        params: {
          status: 'active'
        },
        limit: 10,
        skipSubjectStore: this.skipSubjectStore
      },
      displayFn: (value) => {
        if (this.display === 'name') {
          return `${value.name ? value.name : ''}`;
        }
        return `${value.gst ? value.gst : ''}:${value.address && value.address.city ? value.address.city : ''} ${value.address && value.address.state ? value.address.state : ''}`;
      }
    });
    if (this.organization) {
      this.autocompleteOptions.autoSelect = true;
      this.autocompleteOptions.preFetch = true;
      this.autocompleteOptions.search.params['organization-code'] = this.organization.code;
    }
  }

  ngOnInit() {
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
  }
}
