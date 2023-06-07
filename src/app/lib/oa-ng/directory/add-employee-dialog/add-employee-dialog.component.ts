import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { Employee, Organization } from 'src/app/lib/oa/directory/models';
import { EmployeeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-add-employee-dialog',
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.css']
})
export class AddEmployeeDialogComponent implements OnInit {

  @Input()
  organization: string | Organization;

  employee: Employee;

  @Input()
  options: {
    title?: string,
    view?: string
  } = {};

  constructor(
    private uxService: UxService,
    private employeeService: EmployeeService,
    public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.options = this.options || {};
    this.options.title = this.options.title || 'Add Employee';
    this.options.view = this.options.view || 'employee';
    this.employee = new Employee({
      status: 'active',
      profile: {},
      organization: this.organization
    });
  }

  validate(): string[] {
    let errors = [];
    if (!this.employee.email) {
      errors.push('Email Required!')
    }
    if (!this.employee.phone) {
      errors.push('Phone Required!')
    }
    if (!this.employee.profile.firstName) {
      errors.push('First Name Required!')
    }
    if (!this.employee.profile.lastName) {
      errors.push('Last Name Required!')
    }
    if (!this.employee.designation.name) {
      errors.push('Designation Required!')
    }
    if (!this.employee.department.name) {
      errors.push('Department Required!')
    }
    return errors;
  }

  onSubmit() {
    const errors = this.validate();
    if (errors.length) {
      return this.uxService.showError(errors, { title: 'Check you submission!' })
    }
    this.employeeService.create(this.employee).subscribe((result: any) => {
      this.dialogRef.close(result);
    });
  }

}
