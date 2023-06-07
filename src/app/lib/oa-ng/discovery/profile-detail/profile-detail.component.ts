import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { ProfileDetailsBaseComponent } from 'src/app/lib/oa/discovery/components/profile-details-base.component';
import { Profile } from 'src/app/lib/oa/discovery/models/profile.model';
import { ProfileService } from 'src/app/lib/oa/discovery/services';

@Component({
  selector: 'discovery-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent extends ProfileDetailsBaseComponent {

  constructor(
    public auth: RoleService,
    public api: ProfileService,
    public validator: UxService
  ) {
    super(api, validator, auth);
  }

  createProfile() {
    this.isProcessing = true
    this.api.post({
      id: this.entityId,
      type: this.entityType,
      provider: this.entityProvider
    }, 'createByEntity').subscribe(item => {
      this.properties = new Profile(item)
      this.isProcessing = false
    })
  }

  saveCode() {
    if (!this.properties.code) {
      this.validator.handleError("Code is required.")
      return
    }
    this.isProcessing = true
    this.api.post({
      id: this.properties.id,
      code: this.properties.code
    }, 'generateReferalCode').subscribe(item => {
      this.isProcessing = false
      this.properties = new Profile(item)
      this.validator.showInfo("Code updates successfully.")
    }, err => {
      this.isProcessing = false
    })
  }

}
