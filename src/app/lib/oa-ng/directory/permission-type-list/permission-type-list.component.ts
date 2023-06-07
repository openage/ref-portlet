import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { PermissionTypeListBaseComponent } from 'src/app/lib/oa/directory/components/permission-type-list-base.componet';
import { PermissionGroupService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-permission-type-list',
  templateUrl: './permission-type-list.component.html',
  styleUrls: ['./permission-type-list.component.css']
})
export class PermissionTypeListComponent extends PermissionTypeListBaseComponent {

  @Input()
  view: 'table' | 'list' | 'grid' = 'table';
  dialogRef: any;

  constructor(public dialog: MatDialog,
    service: PermissionGroupService,
    private uxService: UxService
  ) {
    super(service, uxService);
  }

  onRemove(item): void {
    this.uxService.onConfirm().subscribe(() => {
      this.remove(item);
      this.uxService.showInfo('Deleted');
      this.fetch();
    });
  }

}
