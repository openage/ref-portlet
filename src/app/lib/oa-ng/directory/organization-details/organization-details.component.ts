import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { UxService, ValidationService } from 'src/app/core/services';
import { Pic } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { OrganizationDetailsBaseComponent } from 'src/app/lib/oa/directory/components/organization-details-base.component';
import { Organization } from 'src/app/lib/oa/directory/models';
import { OrganizationService } from 'src/app/lib/oa/directory/services';
import { ThumbnailSelectorComponent } from '../../drive/thumbnail-selector/thumbnail-selector.component';

@Component({
  selector: 'directory-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})

export class OrganizationDetailsComponent extends OrganizationDetailsBaseComponent {

  @Input()
  view: 'actionItems' | 'basic' = 'basic';

  @Input()
  required = false;

  @Input()
  isAccountDetails = false;

  error = {
    name: '',
    email: '',
    phone: ''
  };

  constructor(
    public dialog: MatDialog,
    public orgService: OrganizationService,
    public auth: RoleService,
    public vadidator: ValidationService,
    validator: ErrorHandler,
    private uxService: UxService
  ) {
    super(orgService, validator, auth);
  }
  tripSpace() {
    this.properties.name = this.properties.name.replace(/^[ ]+|[ ]+$/g, '');
  }

  setCategory(item) {
    this.properties.meta = { category: item }
  }

  onValidate() {
    let errors = [];
    if (this.error.email) {
      errors.push(`${this.error.email}`)
    }
    if (this.error.phone) {
      errors.push(`${this.error.phone}`)
    }
    if (this.error.name) {
      errors.push(`${this.error.name}`)
    }
    return errors;
  }

  onSave() {
    let errors = this.onValidate();

    if (errors.length) {
      return this.uxService.showError(errors);
    }

    this.save();
  }

  openThumbnailSelector() {
    const dialogRef = this.dialog.open(ThumbnailSelectorComponent, {
      width: '500px',
    });

    dialogRef.componentInstance.cropRatio = 1 / 1;
    dialogRef.componentInstance.okLabel = 'Save';
    dialogRef.componentInstance.dialogTitle = 'Select Logo';
    dialogRef.componentInstance.size = 1;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.properties.logo = new Pic({ url: result });
        this.save();
      }
    });
  }

  checkOrgName = (name: string): Observable<string | null> => {
    const subject = new Subject<string | null>();
    this.orgService.search({ name, fullMatch: true }, { limit: 1 }).subscribe((page) => {
      if (page.items && page.items.length) {
        subject.next('ORGANIZATION_NAME_EXISTS');
      } else {
        subject.next(null);
      }
    });

    return subject.asObservable();
  }

  checkPhoneOrEmail = (value: string): Observable<string | null> => {
    const subject = new Subject<string | null>();
    this.auth.exists(`${value}`).subscribe((result) => {
      if (result.exists) { subject.next('EMAIL_EXISTS'); } else { subject.next(null); }
    });
    return subject.asObservable();
  }

}
