import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/lib/oa/directory/models';
import { UxService } from 'src/app/core/services';
import { NavService } from 'src/app/core/services/nav.service';
import { RoleListComponent } from 'src/app/lib/oa-ng/directory/role-list/role-list.component';
import { Link } from 'src/app/lib/oa/core/structures';
import { EmployeeUploaderComponent } from '../../components/employee-uploader/employee-uploader.component';
import { Entity } from 'src/app/lib/oa/core/models';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css'],
})
export class RolesComponent implements OnInit, OnDestroy {

  @ViewChild('list')
  list: RoleListComponent;

  filters = ['name', 'code'];
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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register('/master/roles', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  onSelect($event: any) {
    this.navService.goto(new Entity({ type: 'role', id: $event.id }))
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
      title: 'Add',
      type: 'raised',
      event: () => this.navService.goto(`/master/roles/new`)
    }, {
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
