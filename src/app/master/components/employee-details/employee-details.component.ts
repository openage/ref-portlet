import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UxService } from 'src/app/core/services/ux.service';
import { EmployeeDetailBaseComponent } from 'src/app/lib/oa/directory/components/employee-detail-base.component';
import { NavService } from 'src/app/core/services/nav.service';
import { Link } from 'src/app/lib/oa/core/structures';
import { IWizStep } from 'src/app/lib/oa/core/structures/wiz/wiz-step.interface';
import { Employee } from 'src/app/lib/oa/directory/models/employee.model';
import { EmployeeService } from 'src/app/lib/oa/directory/services/employee.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent extends EmployeeDetailBaseComponent {

  @Input()
  readonly: boolean;

  employee = new Employee({});

  // @ViewChild('personal') step1: IWizStep;
  @ViewChild('employment') step1: IWizStep;
  // @ViewChild('docs') step3: IWizStep;
  @ViewChild('address') step2: IWizStep;
  // @ViewChild('details') step3: IWizStep;

  @ViewChild('security') step6: IWizStep;
  @ViewChild('password') step7: IWizStep;
  componentRefresh = false;

  page: Link;
  isCurrent = true;

  constructor(
    public employeeService: EmployeeService,
    public uxService: UxService,
    public navService: NavService,
    public route: ActivatedRoute,
    router: Router
  ) {
    super(employeeService, uxService, route, router, navService, uxService, navService, uxService);
    this.afterUpdate = (employee) => {
      if (!this.readonly) {
        this.uxService.handleError(`Employee Updated Successfully`);
        this.employee = employee;
      }
    };
  }

  setSupervisor($event: Employee) {
    this.properties.supervisor = $event;
  }

  onSave(): Observable<any> | boolean {
    this.navService.back();
    return true;
  }

  wizInit() {
    // this.step1.title = 'Personal';
    // this.step1.code = 'personal';
    // this.step1.icon = 'account_circle';
    // this.step1.required = true;

    this.step1.title = 'Employment';
    this.step1.code = 'employment';
    this.step1.icon = 'person';
    this.step1.required = true;

    // this.step3.title = 'Documents';
    // this.step3.code = 'docs';

    this.step2.title = 'Address';
    this.step2.code = 'address';
    this.step2.icon = 'home_work';
    this.step2.required = true;

    this.step6.title = 'Security';
    this.step6.code = 'security';
    this.step6.icon = 'lock';

    this.step7.title = 'Reset Password';
    this.step7.code = 'password';
    this.step7.icon = 'lock';

    this.steps.push(this.step1);
    this.steps.push(this.step2);
    // this.steps.push(this.step3);
    // this.steps.push(this.step4);
    // this.steps.push(this.step5);
    this.steps.push(this.step6);
    this.steps.push(this.step7);
    // this.steps.push(this.step8);
  }
}
