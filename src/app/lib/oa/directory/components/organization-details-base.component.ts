import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { RoleService } from '../../core/services';
import { Organization } from '../models';
import { OrganizationService } from '../services';
@Directive()
export class OrganizationDetailsBaseComponent extends DetailBase<Organization> implements OnInit, OnChanges {

  @Input()
  code = 'my';

  @Input()
  readonly: boolean;

  @Output()
  complete: EventEmitter<Organization> = new EventEmitter();

  studentEdit = false;
  dueAmount = 0;

  constructor(
    api: OrganizationService,
    errorHandler: ErrorHandler,
    public auth: RoleService
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {
    if (this.properties && this.properties.code) {
      return;
    }
    const currentOrganization = this.auth.currentOrganization();
    if (!this.code && currentOrganization) {
      this.code = currentOrganization.code;
    }
    this.isProcessing = true;
    this.get(this.code).subscribe((item) => {
      this.properties = new Organization(item);
      this.complete.emit(new Organization(item));
      this.isProcessing = false;
    });
  }

  ngOnChanges() { }

  updateOrg() {
    this.isProcessing = true;
    this.update(this.properties).subscribe((org) => {
      this.properties = new Organization(org);
      this.complete.emit(this.properties);
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
    });
  }

}
