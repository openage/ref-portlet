import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, switchMap } from 'rxjs/operators';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Organization } from 'src/app/lib/oa/directory/models/organization.model';
import { OrganizationService } from 'src/app/lib/oa/directory/services/organization.service';

@Component({
  selector: 'directory-organization-picker',
  templateUrl: './organization-picker.component.html',
  styleUrls: ['./organization-picker.component.css']
})
export class OrganizationPickerComponent implements OnInit, OnChanges {

  @Input()
  view = 'picker';

  @Input()
  componentName = 'directory|organization|picker';

  @Input()
  storeKeys = {
    'id': '${data.id}',
    'code': '${data.code}',
    'name': '${data.name}'
  };

  @Input()
  me = false;

  @Input()
  label: string;

  @Input()
  required = false;

  @Input()
  placeholder = 'Select Organization';

  @Input()
  readonly = false;

  @Input()
  value: Organization = new Organization({});

  @Input()
  type: string;

  activeStatus: string = '';

  @Input()
  status: string;

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
    public organizationService: OrganizationService,
    private auth: RoleService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.me) {
      const user = this.auth.currentUser();
      this.items = (user.roles
        .filter((role) => role.organization && role.organization.type === this.type))
        .map((role) => role.organization);
    }
  }

  ngOnInit() {
    if (this.type) {
      this.componentName = `directory|organization-${this.type}|picker`;
      if (this.type === 'supplier') { this.activeStatus = 'active' }
    }

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
