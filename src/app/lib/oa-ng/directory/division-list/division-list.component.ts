import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService, ValidationService } from 'src/app/core/services';
import { DivisionListBaseComponent } from 'src/app/lib/oa/directory/components/division-list-base.component';
import { Division } from 'src/app/lib/oa/directory/models';
import { DivisionService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-division-list',
  templateUrl: './division-list.component.html',
  styleUrls: ['./division-list.component.css']
})
export class DivisionListComponent extends DivisionListBaseComponent {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';
  dialogRef: any;

  constructor(
    public validationService: ValidationService,
    api: DivisionService,
    private uxService: UxService
  ) {
    super(api, uxService);
  }

  edit(department: Division, isEdit: boolean) {
    if (isEdit) {
      department.isEdit = true;
    } else {
      department.isEdit = false;
    }
  }

  save(item) {
    item.isEdit = false;
    this.update(item);
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
