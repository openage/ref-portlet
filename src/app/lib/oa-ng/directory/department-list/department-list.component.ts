import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService, ValidationService } from 'src/app/core/services';
import { DepartmentListBaseComponent } from 'src/app/lib/oa/directory/components/department-list-base.component';
import { Department } from 'src/app/lib/oa/directory/models';
import { DepartmentService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent extends DepartmentListBaseComponent {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  isFilter = false;
  dialogRef: any;

  constructor(public dialog: MatDialog,
    public validationService: ValidationService,
    api: DepartmentService,
    public uxService: UxService
  ) {
    super(api, uxService);
  }

  edit(department: Department, isEdit: boolean) {
    if (isEdit) {
      department.isEdit = true;
    } else {
      this.fetch();
      department.isEdit = false;
    }
  }

  save(item) {
    item.isEdit = false;
    this.update(item);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  openDialog(item): void {
    this.uxService.onConfirm({
      message: 'Are you sure you want to delete?'
    }).subscribe(() => {
      this.remove(item);
      this.uxService.showInfo('Deleted');
    });
  }
}
