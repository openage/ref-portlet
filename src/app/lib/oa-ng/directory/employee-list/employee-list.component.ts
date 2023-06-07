import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { PageOptions } from 'src/app/lib/oa/core/models';
import { EmployeeListBaseComponent } from 'src/app/lib/oa/directory/components/employee-list-base.component';
import { EmployeeService } from 'src/app/lib/oa/directory/services/employee.service';

@Component({
  selector: 'directory-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent extends EmployeeListBaseComponent {
  @Input()
  view: 'table' | 'list' | 'grid' = 'table';
  dialogRef: any;

  constructor(
    public dialog: MatDialog,
    employeeService: EmployeeService,
    private uxService: UxService
  ) {
    super(employeeService, uxService);
  }

  onRemove(item): void {
    this.uxService.onConfirm().subscribe(() => {
      this.remove(item);
      this.fetch();
      this.uxService.showInfo('Deleted');
    });
  }
}
