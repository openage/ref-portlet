import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { WizStepBaseComponent } from 'src/app/lib/oa/core/structures/wiz/wiz-step-base.component';
import { Department, Designation, Division, Employee } from 'src/app/lib/oa/directory/models';
import { DepartmentService, DesignationService, DivisionService, EmployeeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-employment-viewer',
  templateUrl: './employment-viewer.component.html',
  styleUrls: ['./employment-viewer.component.css']
})
export class EmploymentViewerComponent extends WizStepBaseComponent implements OnInit, OnChanges {

  @Input()
  employee: Employee;

  @Input()
  readonly = true;

  @Input()
  usercode: string;

  designation: Designation;

  department: Department;

  employees: Employee;

  constructor(
    private api: EmployeeService,
    private designationService: DesignationService,
    private departmentService: DepartmentService,
    private divisionService: DivisionService

  ) {
    super();

  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.employee && this.employee.designation && this.employee.designation.id) {
      this.designationService.get(this.employee.designation.id).subscribe((item) => {
        this.designation = item;
      });
    }
    if (this.employee && this.employee.department && this.employee.department.id) {
      this.departmentService.get(this.employee.department.id).subscribe((item) => {
        this.department = item;
      });
    }

    if (this.employee && this.employee.id) {
      this.api.get(this.employee.id).subscribe((item) => {
        this.employees = item;
      });
    }

  }

  supervisorSelected($event: Employee) {
    this.employee.supervisor = $event;
  }

  departmentSelected($event: Department) {
    this.employee.department = $event;
  }

  divisionSelected($event: Division) {
    this.employee.division = $event;
  }

  validate(): boolean {
    // if (!this.employee.supervisor || !this.employee.supervisor.id) {
    //   return false;
    // }
    // if (!this.employee.designation) {
    //   return false;
    // }
    // if (!this.employee.department) {
    //   return false;
    // }

    if (this.employee.supervisor) {
      if (this.employee.designation) {

        return true;

      }
    }
    return false;

  }

  complete(): boolean | Observable<any> {
    if (!this.employee.type) {
      this.employee.type = 'normal',
        this.employee.status = 'active';
    }
    // TODO: add defaults
    if (this.readonly) {
      return this.api.get(this.employee.id);
    }
    if (this.employee.id) {
      return this.api.update(this.employee.id, this.employee);
    } else {
      return this.api.create(this.employee);
    }
  }

}
