import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { UxService, ValidationService } from 'src/app/core/services';
import { ErrorModel, Pic } from 'src/app/lib/oa/core/models';
import { RoleDetailsBaseComponent } from 'src/app/lib/oa/directory/components/role-details-base.component';
import { RoleType } from 'src/app/lib/oa/directory/models';
import { DirectoryRoleService } from 'src/app/lib/oa/directory/services';
import { ThumbnailSelectorComponent } from '../../drive/thumbnail-selector/thumbnail-selector.component';

@Component({
  selector: 'directory-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent extends RoleDetailsBaseComponent {

  error: ErrorModel;

  types: RoleType[] = [];

  constructor(
    private api: DirectoryRoleService,
    uxService: UxService,
    public validationService: ValidationService,
    public dialog: MatDialog
  ) {
    super(api, uxService);

    this.types = api.systemRoles;

    this.validate = () => {
      const errors = [];

      if (this.error) { errors.push(this.error); }

      if (!this.properties.type || !this.properties.type.code) {
        errors.push('Role is required');
      }
      if (!this.properties.profile.firstName) {
        errors.push('First Name is required');
      }
      if (!this.properties.profile.lastName) {
        errors.push('Last Name is required');
      }
      return errors;
    };
  }

  emailDoesNotExist = (email: string): Observable<string | null> => {
    const subject = new Subject<string | null>();
    this.api.search({ email }, { limit: 1 }).subscribe({
      next: (page: any) => {
        if (page.items && page.items.length) {
          subject.next('EMAIL_EXISTS');
        } else {
          subject.next(null);
        }
      }, error: (err) => {
        if (err.message === 'RESOURCE_NOT_FOUND') {
          subject.next(null);
        }
      }
    });
    return subject.asObservable();
  }

  mobileDoesNotExist = (phone: string): Observable<string | null> => {
    const subject = new Subject<string | null>();
    this.api.search({ phone }, { limit: 1 }).subscribe({
      next: (page: any) => {
        if (page.items && page.items.length) {
          subject.next('PHONE_EXISTS');
        } else {
          subject.next(null);
        }
      }, error: (err) => {
        if (err.message === 'RESOURCE_NOT_FOUND') {
          subject.next(null);
        }
      }
    });
    return subject.asObservable();
  }

  openThumbnailSelector() {
    const dialogRef = this.dialog.open(ThumbnailSelectorComponent, {
      width: '500px',
    });

    dialogRef.componentInstance.cropRatio = 1 / 1;
    dialogRef.componentInstance.okLabel = 'Save';
    dialogRef.componentInstance.dialogTitle = 'Select Picture';

    dialogRef.afterClosed().subscribe((result) => {
      if (result) { this.properties.profile.pic = new Pic({ url: result }); }
    });
  }

  setRoleType(code: string) {
    const type = this.types.find((i) => i.code === code);
    this.properties.type = new RoleType(type);
  }

  onReset() {
    this.api.post({}, `${this.properties.id}/reset`).subscribe();
  }
}
