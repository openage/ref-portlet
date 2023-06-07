import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, Injectable } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { Observable } from 'rxjs';
import { ValidationService } from 'src/app/core/services';
import { Pic } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { WizStepBaseComponent } from 'src/app/lib/oa/core/structures/wiz/wiz-step-base.component';
import { Department, Designation, Division, Employee } from 'src/app/lib/oa/directory/models';
import { EmployeeService } from 'src/app/lib/oa/directory/services';
import { DocsService } from 'src/app/lib/oa/drive/services';
// import { ResetPasswordEditorComponent } from '../reset-password-editor/reset-password-editor.component';

// export const PICK_FORMATS = {
//   parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
//   display: {
//     dateInput: 'input',
//     monthYearLabel: { year: 'numeric', month: 'short' },
//     dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
//     monthYearA11yLabel: { year: 'numeric', month: 'long' }
//   }
// };

// export class PickDateAdapter extends NativeDateAdapter {
//   format(date: Date, displayFormat: any): string {
//     if (displayFormat === 'input') {
//       return formatDate(date, 'dd/MM/yyyy', this.locale);
//     } else {
//       return date.toDateString();
//     }
//   }
// }
// eslint-disable-next-line max-classes-per-file
@Component({
  selector: 'directory-employment-editor',
  templateUrl: './employment-editor.component.html',
  styleUrls: ['./employment-editor.component.css'],
  providers: [
    // { provide: DateAdapter, useClass: PickDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS }
  ]
})
export class EmploymentEditorComponent extends WizStepBaseComponent implements OnInit {

  @Input()
  employee: Employee;

  @Input()
  readonly = false;

  @ViewChild('fileInput')
  fileInput;
  date: any;
  emailError: string;
  email = '';
  isProcessing = false;
  image: File;
  maxDate: Date = new Date();

  // @ViewChild('password', {static: false})
  // password: ResetPasswordEditorComponent;

  constructor(
    private api: EmployeeService,
    private auth: RoleService,
    private validationService: ValidationService,
    private docsService: DocsService
  ) {
    super();
  }

  ngOnInit() {

  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.image = files[0];
    this.docsService.upload(this.image).subscribe((doc) => {
      this.employee.profile.pic = new Pic({
        url: doc.url,
        thumbnail: doc.thumbnail
      });
    });
  }

  supervisorSelected($event: any) {
    this.employee.supervisor = $event;
  }

  designationSelected($event: Designation) {
    this.employee.designation = $event;
  }

  departmentSelected($event: Department) {
    this.employee.department = $event;
  }

  divisionSelected($event: Division) {
    this.employee.division = $event;
  }

  validateEmail() {
    this.auth.exists(this.employee.email).subscribe((item) => {
      if (item.exists) {
        this.emailError = `${this.employee.email} is already Taken`;
        this.employee.email = null;
      } else {
        this.emailError = '';
      }
    });
  }

  onPicSelect($event) {
    const files = $event.srcElement.files;
    this.image = files && files.length ? files[0] : null;
    this.docsService.upload(this.image).subscribe((doc) => {
      this.employee.profile.pic = new Pic({
        url: doc.url,
        thumbnail: doc.thumbnail
      });
    });
  }

  removePic() {
    this.employee.profile.pic = new Pic();
  }

  validate(): any {
    // if (!this.employee.supervisor || !this.employee.supervisor.id) {
    //   return false;
    // }
    // if (!this.employee.designation) {
    //   return false;
    // }
    // if (!this.employee.department) {
    //   return false;
    // }

    // if (this.employee.supervisor  ) {
    //   if ( this.employee.designation) {

    // return true;

    //     }
    // }
    // return false;

    if (!this.employee.email) {
      return 'Email is Required';
    }
    if (!this.employee.phone) {
      return 'Phone is Required';
    }
    if (!this.employee.profile.dob) {
      return 'DOB is Required';
    }
    if (!this.employee.doj) {
      return 'Date Of Joining is Required';
    }
    if (!this.employee.config.aadhaar) {
      return 'Aadhaar Number is Required';
    }
    if (!this.employee.profile.fatherName) {
      return 'Father Name is Required';
    }
    if (!this.employee.profile.bloodGroup) {
      return 'Blood Group is Required';
    }
    if (!this.employee.profile.gender) {
      return 'Gender is Required';
    }

    if (this.employee.email && this.validationService.isEmailValid(this.employee.email)) {
      return 'Incorrect Email';
    }

    if (this.employee.phone && this.validationService.isMobileValid(this.employee.phone)) {
      return 'Incorrect Phone';
    }

    if (!this.employee.profile.firstName) {
      return 'First Name is Required';
    }

    return true;

  }

  complete(): boolean | Observable<any> {
    if (!this.employee.type) {
      this.employee.type = 'normal';
    }
    if (!this.employee.status) {
      this.employee.status = 'active';
    }
    // TODO: add defaults
    if (this.readonly) {
      if (this.employee && this.employee.profile && this.employee.profile.pic) {
        return this.api.update(this.employee.id, {
          profile: {
            pic: this.employee.profile.pic
          }
        });
      }
      return this.api.get(this.employee.id);
    }
    if (this.employee.id) {
      return this.api.update(this.employee.id, this.employee);
    } else {
      return this.api.create(this.employee);
    }
  }

}
