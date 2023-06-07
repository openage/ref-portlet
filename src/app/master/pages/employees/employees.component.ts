import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EmployeeListComponent } from 'src/app/lib/oa-ng/directory/employee-list/employee-list.component';
import { Employee } from 'src/app/lib/oa/directory/models';
import { UxService } from 'src/app/core/services';
import { NavService } from 'src/app/core/services/nav.service';
import { AddEmployeeDialogComponent } from 'src/app/lib/oa-ng/directory/add-employee-dialog/add-employee-dialog.component';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { EmployeeUploaderComponent } from '../../components/employee-uploader/employee-uploader.component';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
})
export class EmployeesComponent extends PageBaseComponent {

  @ViewChild('list')
  list: EmployeeListComponent;

  filters = ['name', 'code', 'department-id', 'division-id', 'designation-id', 'contractor-id', 'supervisor', 'type', 'employee-type'];
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
  selectedContractor: string;

  isCurrent = true;
  page: Link;
  constructor(
    public dialog: MatDialog,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute,
    private auth: RoleService,
    private cache: LocalStorageService
  ) {
    super(navService, uxService, auth, route, cache);

    this.params.subscribe(params => {
      if (!this.isCurrent) {
        return;
      }

      this.init(params);
    });

    this.uxService.onSearch.subscribe((query) => {
      this.onSearch(query);
    })
  }

  init(params: any) {
    if (this.isInitialized) {
      return;
    }
    // this.selectedStatus = params.get('status-code');
    // this.selectedName = params.get('name');
    this.isInitialized = true;
  }

  // ngOnInit() {
  //   this.navService.register('/master/employees', this.route, (isCurrent, params) => {
  //     this.isCurrent = isCurrent;
  //     if (this.isCurrent) {
  //       this.setContext();
  //     }
  //   }).then((link) => this.page = link);
  // }

  // ngOnDestroy(): void {
  //   this.uxService.reset();
  // }

  onSelect($event: Employee) {
    this.navService.goto(`/master/employees/${$event.id}`);
  }

  addDialog() {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.list.fetch();
      }
    });
    // this.list.onNew();
  }

  onRefresh() {
    this.list.fetch();
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(EmployeeUploaderComponent, {
  //     width: '550px',
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     this.ngOnInit();
  //   });
  // }

  // setContext() {
  //   // this.uxService.setContextMenu([{
  //   //   title: 'Import',
  //   //   type: 'raised',
  //   //   event: () => this.openDialog()
  //   //   // event: () => this.uxService.openDialog(EmployeeUploaderComponent)
  //   // }, {
  //   //   title: 'New',
  //   //   type: 'raised',
  //   //   event: () => this.navService.goto(`/master/employees/new`)
  //   // }, {
  //   //   type: 'icon',
  //   //   icon: 'filter_list',
  //   //   event: () => { this.showFilters = !this.showFilters; }
  //   // }]);

  //   const actions: any[] = [];
  //   // if (this.page.meta.search && this.page.meta.search.view === 'context') {
  //   //   actions.push({ event: (v) => this.onSearch(v), search: this.page.meta.search });
  //   // }

  //   actions.push({
  //     filters: () => { this.showFilters = !this.showFilters; }
  //   }, {
  //     refresh: () => {
  //       this.onRefresh();
  //     }
  //   }, {
  //     helpCode: this.page.meta.helpCode
  //   }, 'close');

  //   this.uxService.setContextMenu(actions);
  // }

  onSearch(query: any) {
    const selected = this.page.meta.selected || {};
    this.selectedName = query.text;
    this.selectedCode = query.code;
    this.selectedStatus = query.status || selected.status;
    this.selectedSupervisor = query.supervisor || selected.supervisor;
    this.selectedEmployeeTypes = query.types || selected.types;
    this.selectedDepartment = query.department || selected.department;
    this.selectedDivision = query.division || selected.division;
    this.selectedDesignation = query.designation || selected.designation;
    this.selectedContractor = query.contractor || selected.contractor;
  }

  setContext(context) {
    context.forEach((item) => {
      switch (item.code) {
        case 'add':
          item.event = () => this.addDialog();
          break;

        case 'refresh':
          item.refresh = () => this.onRefresh();
          break;
      }
    });
    return context;
  }

  onStatSelect($event) {
    this.navService.goto($event.routerLink, $event.queryParams);
  }
}
