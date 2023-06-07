import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { PermissionGroup } from 'src/app/lib/oa/core/structures';
import { PermissionGroupService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'app-role-permissions-dialog',
  templateUrl: './role-permissions-dialog.component.html',
  styleUrls: ['./role-permissions-dialog.component.css']
})
export class RolePermissionsDialogComponent implements OnInit {

  permissions: any[];

  groups: PermissionGroup[];

  constructor(
    public dialog: MatDialogRef<RolePermissionsDialogComponent>,
    private uxService: UxService,
    private permissionGroupService: PermissionGroupService
  ) { }

  ngOnInit() {
    this.permissionGroupService.search().subscribe((page) => {
      this.groups = page.items;
      if (this.permissions) {
        this.checkPermissions(this.permissions);
      }
    });
  }

  cancel() {
    this.dialog.close();
  }

  save() {
    this.dialog.close(this.permissions);
  }

  checkPermissions(permissions) {
    if (permissions.length) {
      permissions.forEach((permission) => {
        this.markExist(permission);
      });
    }
  }

  markExist(permission) {
    this.groups.forEach((group) => {
      group.permissions.forEach((item) => {
        if (item.code === permission) {
          item.isEdit = true;
        }
      });
    });
  }

  togglePermissions($event, permission) {
    if ($event.checked) {
      if (!(this.checkIndex(permission) >= 0)) {
        this.permissions.push(permission);
      }
    } else {
      if (this.checkIndex(permission) >= 0) {
        this.permissions = this.removefromArray(this.permissions, this.checkIndex(permission));
      }
    }
  }

  checkIndex(permission): number {
    let index;
    let i = 0;
    this.permissions.forEach((item) => {
      if (permission === item) {
        index = i;
      }
      i++;
    });
    return index;
  }

  removefromArray(array, index) {
    const arr = [];
    let i = 0;
    array.forEach((item) => {
      if (i !== index) {
        arr.push(item);
      }
      i++;
    });
    return arr;
  }

}
