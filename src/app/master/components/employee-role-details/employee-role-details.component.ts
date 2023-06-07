import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavService, UxService } from 'src/app/core/services';
import { RoleDetailsComponent } from 'src/app/lib/oa-ng/directory/role-details/role-details.component';
import { EmployeeDetailBaseComponent } from 'src/app/lib/oa/directory/components/employee-detail-base.component';
import { Employee, Role } from 'src/app/lib/oa/directory/models';
import { EmployeeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'master-employee-role-details',
  templateUrl: './employee-role-details.component.html',
  styleUrls: ['./employee-role-details.component.css']
})
export class EmployeeRoleDetailsComponent extends EmployeeDetailBaseComponent implements OnChanges {

  @ViewChild('roleDetails')
  roleDetails: RoleDetailsComponent

  @Input()
  divs: any[] = []

  filters: any[] = []
  employee = new Employee({});
  view: string = 'timelog'
  role: Role = new Role();
  selectedDate: any = new Date();

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
        this.employee = employee;
      }
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.divs && changes.divs.firstChange) {
      this.divs = JSON.parse(JSON.stringify(this.divs));
    }
    super.ngOnChanges(changes);
  }

  onSave(): Observable<any> | boolean {
    this.navService.back();
    return true;
  }

  wizInit() { }

  afterFetchRole($event) {
    this.role = $event;
    this.filters = [{ 'key': 'roleId', 'value': this.role.id }]
  }

}
