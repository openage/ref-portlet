/* eslint-disable @angular-eslint/contextual-lifecycle */
import { ErrorHandler, EventEmitter, Injectable, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { RoleService } from '../../core/services';
import { Organization } from '../models';
import { OrganizationService } from '../services';

@Injectable()
export class NewOrganizationBaseComponent extends DetailBase<Organization> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly: boolean;

  @Output()
  complete: EventEmitter<Organization> = new EventEmitter();

  studentEdit = false;

  constructor(
    api: OrganizationService,
    errorHandler: ErrorHandler,
    public auth: RoleService
  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {

  }

  ngOnChanges() { }

  updateOrg() {
    this.isProcessing = true;
    this.update(this.properties).subscribe((org) => {
      const role = this.auth.currentRole();
      role.organization = org;
      this.auth.setRole(role);
      this.complete.emit(org);
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
    });
  }

}
