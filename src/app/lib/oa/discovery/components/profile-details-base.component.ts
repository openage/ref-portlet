import { ErrorHandler, EventEmitter, Input, OnChanges, OnInit, Output, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { RoleService } from '../../core/services';
import { Profile } from '../models/profile.model';
import { ProfileService } from '../services';

@Directive()
export class ProfileDetailsBaseComponent extends DetailBase<Profile> implements OnInit, OnChanges {

  @Input()
  entityId: string;

  @Input()
  entityType: string;

  @Input()
  entityProvider: string;

  constructor(
    public api: ProfileService,
    errorHandler: ErrorHandler,
    public auth: RoleService
  ) {
    super({ api });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.isProcessing = true
    if (this.entityId && this.entityType) {
      this.api.get(`getByEntity?entity-id=${this.entityId}&entity-type=${this.entityType}`).subscribe(item => {
        this.properties = new Profile(item)
        this.isProcessing = false
      }, err => {
        this.isProcessing = false
      })
    }
  }

}
