import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Organization } from 'src/app/lib/oa/gateway/models';
import { GatewayOrganizationService } from 'src/app/lib/oa/gateway/services/organization.service';

@Component({
  selector: 'gateway-organization-picker',
  templateUrl: './organization-picker.component.html',
  styleUrls: ['./organization-picker.component.css']
})
export class OrganizationPickerComponent implements OnInit, OnChanges {

  @Input()
  view = 'picker';

  @Input()
  me = false;

  @Input()
  placeholder = 'Select Organization';

  @Input()
  readonly = false;

  @Input()
  value: Organization = new Organization({});

  @Input()
  type: 'customer' | 'supplier';

  @Input()
  options: {
    show?: {
      icon?: boolean
    }
  };

  @Output()
  changed: EventEmitter<Organization> = new EventEmitter();

  isProcessing = false;
  items: Organization[] = [];

  constructor(
    public organizationService: GatewayOrganizationService,
    private auth: RoleService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void { }

  ngOnInit() {
    this.options = this.options || {};
    this.options.show = this.options.show || {};
  }

  onSelect($event: any) {
    this.value = $event;
    this.changed.emit(this.value);
  }

  onSelection(code: string) {
    this.value = new Organization(this.items.find((item) => item.code === code));
    this.changed.emit(this.value);
  }

}
