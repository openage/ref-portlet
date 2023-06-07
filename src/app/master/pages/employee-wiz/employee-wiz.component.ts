import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { NavService } from 'src/app/core/services/nav.service';
import { Link } from 'src/app/lib/oa/core/structures';
import { WizBaseComponent } from 'src/app/lib/oa/core/structures/wiz/wiz-base.component';
import { IWizStep } from 'src/app/lib/oa/core/structures/wiz/wiz-step.interface';
import { Employee } from 'src/app/lib/oa/directory/models';

@Component({
  selector: 'app-employee-wiz',
  templateUrl: './employee-wiz.component.html',
  styleUrls: ['./employee-wiz.component.css']
})
export class EmployeeWizComponent extends WizBaseComponent {

  employee = new Employee({});
  componentRefresh = false;
  readonly = false;

  // @ViewChild('personal') step1: IWizStep;
  @ViewChild('employment') step1: IWizStep;
  // @ViewChild('docs', {static: false}) step3: IWizStep;
  // @ViewChild('address', {static: false}) step2: IWizStep;
  // @ViewChild('details', {static: false}) step3: IWizStep;

  isCurrent = true;
  page: Link;

  constructor(
    private uxService: UxService,
    private navService: NavService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(route, router, navService, uxService, navService, uxService, uxService);
    this.afterCreate = (employee) => {
      this.uxService.handleError(`Employee Create Successfully ( Code : ${employee.code} )`);
      this.employee = employee;
      this.router.navigate(['/', 'master', 'employees', this.employee.id]);
    };
  }

  onSave(): Observable<any> | boolean {
    // this.uxService.handleError(`Employee Updated Successfully`);
    return true;
  }

  onChange(employee) {
    this.employee = employee;
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

    // this.step2.title = 'Address';
    // this.step2.code = 'address';
    // this.step2.icon = 'home_work';
    // this.step2.required = true;

    // this.step3.title = 'Account Details';
    // this.step3.code = 'details';
    // this.step3.icon = 'account_balance';
    // this.step3.required = true;

    this.steps.push(this.step1);
    // this.steps.push(this.step2);
    // this.steps.push(this.step3);
    // this.steps.push(this.step3);
    // this.steps.push(this.step4);
    // this.steps.push(this.step5);
    // this.steps.push(this.step6);
    // this.steps.push(this.step8);

    this.navService.register('/master/employees/new', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
    }).then((link) => this.page = link);

  }

}
