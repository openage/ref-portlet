import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { RoleListBaseComponent } from 'src/app/lib/oa/directory/components/role-list-base.component';
import { DirectoryRoleService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
})
export class RoleListComponent extends RoleListBaseComponent {
  @Input()
  view: 'table' | 'list' | 'grid' = 'table';

  @Input()
  columns: string[] = ['name', 'code', 'action'];

  dialogRef: any;

  constructor(
    public dialog: MatDialog,
    service: DirectoryRoleService,
    private uxService: UxService
  ) {
    super(service, uxService);
  }

  onRemove(item): void {
    this.uxService.onConfirm().subscribe(() => {
      this.remove(item);
      this.uxService.showInfo('Deleted');
    });
  }

}
