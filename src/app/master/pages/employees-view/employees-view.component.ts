import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmployeeListComponent } from 'src/app/lib/oa-ng/directory/employee-list/employee-list.component';
import { Employee } from 'src/app/lib/oa/directory/models';
import { UxService } from 'src/app/core/services';
import { NavService } from 'src/app/core/services/nav.service';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { EmployeeUploaderComponent } from '../../components/employee-uploader/employee-uploader.component';

@Component({
  selector: 'app-employees-view',
  templateUrl: './employees-view.component.html',
  styleUrls: ['./employees-view.component.css'],
})
export class EmployeesViewComponent implements OnInit, OnDestroy {

  @ViewChild('list')
  list: EmployeeListComponent;

  filters = ['name', 'code', 'department-id', 'division-id', 'designation-id', 'supervisor', 'type', 'employee-type'];
  showFilters = false;

  selectedName: string;
  selectedStatus: string;
  selectedSupervisor: string;
  selectedUserType: string;
  selectedEmployeeTypes: string;
  selectedCode: string;
  selectedDepartment: string;
  selectedDivision: string;
  selectedDesignation: string;
  // selectedContractor: string;

  isCurrent = true;
  page: Link;
  constructor(
    public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private auth: RoleService
  ) { }

  ngOnInit() {
    this.navService.register('/master/employeesView', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  onSelect($event: Employee) {
    this.navService.goto(`/master/employeesView/${$event.id}`);
  }

  onRefresh() {
    this.list.fetch();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EmployeeUploaderComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  setContext() {
    this.uxService.setContextMenu([{
      type: 'icon',
      icon: 'filter_list',
      event: () => { this.showFilters = !this.showFilters; }
    }]);
  }

  applyFilter(values: any[]) {
    this.resetFilters();

    const name = values.find((i) => i.key === 'name');
    if (name) {
      this.selectedName = name.value;
    }
    const status = values.find((i) => i.key === 'status');
    if (status) {
      this.selectedStatus = status.value[0];
    }
    const code = values.find((i) => i.key === 'code');
    if (code) {
      this.selectedCode = code.value;
    }
    const department = values.find((i) => i.key === 'department-id');
    if (department) {
      this.selectedDepartment = department.value.toString();
    }
    const division = values.find((i) => i.key === 'division-id');
    if (division) {
      this.selectedDivision = division.value.toString();
    }
    const designation = values.find((i) => i.key === 'designation-id');
    if (designation) {
      this.selectedDesignation = designation.value.toString();
    }
    const userType = values.find((i) => i.key === 'type');
    if (userType) {
      this.selectedUserType = userType.value.toString();
    }
    const employeetype = values.find((i) => i.key === 'employee-type');
    if (employeetype) {
      this.selectedEmployeeTypes = employeetype.value.toString();
    }
    const supervisor = values.find((i) => i.key === 'supervisor');
    if (supervisor) {
      this.selectedSupervisor = supervisor.value.toString();
    }
    // const contractor = values.find((i) => i.key === 'contractor-id');
    // if (contractor) {
    //   this.selectedContractor = contractor.value.toString();
    // }
  }

  resetFilters() {
    this.selectedName = null;
    this.selectedStatus = null;
    this.selectedSupervisor = null;
    this.selectedUserType = null;
    this.selectedEmployeeTypes = null;
    this.selectedCode = null;
    this.selectedDepartment = null;
    this.selectedDivision = null;
    this.selectedDesignation = null;
    // this.selectedContractor = null;
  }
}
