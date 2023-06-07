import { Component, ErrorHandler, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService, ValidationService } from 'src/app/core/services';
import { SignUpBaseComponent } from 'src/app/lib/oa/auth/components/join-base-component';
import { Pic } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Organization, User } from 'src/app/lib/oa/directory/models';
import { OrganizationService } from 'src/app/lib/oa/directory/services';
import { ThumbnailSelectorComponent } from '../../drive/thumbnail-selector/thumbnail-selector.component';

@Component({
  selector: 'directory-organization-create',
  templateUrl: './organization-create.component.html',
  styleUrls: ['./organization-create.component.css']
})

export class OrganizationCreateComponent extends SignUpBaseComponent implements OnInit {

  @Input()
  orgType: string;

  @Input()
  showBtn = true;

  gstError: boolean;

  @Input()
  referralCode: string

  constructor(
    public dialog: MatDialog,
    public orgService: OrganizationService,
    private uxService: UxService,
    errorHandler: ErrorHandler,
    auth: RoleService,
    validator: ValidationService
  ) {
    super(auth, orgService, validator, errorHandler);
  }

  ngOnInit() {
    this.organization = new Organization({ meta: {}, type: this.orgType });
    if (this.referralCode) {
      this.organization.meta.referralCode = this.referralCode
    }
    if (this.auth.currentUser()) { this.profile = this.auth.currentUser().profile; }
    // this.checkOrg();
  }

  setGstError(value) {
    this.gstError = !!value;
  }

  tripSpace() {
    this.organization.name = this.organization.name.replace(/^[ ]+|[ ]+$/g, '');
  }

  checkOrg() {
    const code = this.makeid(6);
    this.orgService.post({ code }, 'isAvailable').subscribe((response) => {
      this.organization = new Organization({ meta: {} });
      if (response.isAvailable) {
        this.organization.code = code;
        this.organization.type = this.orgType;
      } else {
        this.organization.code = response.available;
      }
    }, (err) => {
      this.uxService.handleError(err.message);
    });
  }

  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  openThumbnailSelector() {
    const dialogRef = this.dialog.open(ThumbnailSelectorComponent, {
      width: '500px',
    });

    dialogRef.componentInstance.cropRatio = 1 / 1;
    dialogRef.componentInstance.okLabel = 'Save';
    dialogRef.componentInstance.dialogTitle = 'Select Logo';

    dialogRef.afterClosed().subscribe((result) => {
      if (result) { this.organization.logo = new Pic({ url: result }); }
    });
  }

  checkRequired() {
    if (!this.organization.name) {
      return this.uxService.handleError('Company name required');
    }

    if (!this.organization.address || !(this.organization.address.line1 && this.organization.address.pinCode ||
      this.organization.address.state && this.organization.address.city)) {
      return this.uxService.handleError('Address required');
    }

    if (!this.organization.meta || !this.organization.meta.gst) {
      return this.uxService.handleError('GST required');
    } else if (this.gstError) {
      return this.uxService.handleError('GST incorrect');
    }

    this.join();
  }

}
