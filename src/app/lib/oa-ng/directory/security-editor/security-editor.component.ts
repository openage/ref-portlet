import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { PermissionGroup } from 'src/app/lib/oa/core/structures';
import { RoleListBaseComponent } from 'src/app/lib/oa/directory/components/role-list-base.component';
import { Role, RoleType } from 'src/app/lib/oa/directory/models';
import { DirectoryRoleService, PermissionGroupService } from 'src/app/lib/oa/directory/services';
import { RolePermissionsDialogComponent } from '../role-permissions-dialog/role-permissions-dialog.component';

@Component({
  selector: 'directory-security-editor',
  templateUrl: './security-editor.component.html',
  styleUrls: ['./security-editor.component.css']
})

export class SecurityEditorComponent extends RoleListBaseComponent implements OnInit {

  @Input()
  readonly: boolean;

  @Input()
  role: Role;

  @Output()
  changed: EventEmitter<any> = new EventEmitter();

  groups: PermissionGroup[];

  code: string;
  icon: string;
  title: string;

  isSelected: boolean;
  isOpen: boolean;
  isComplete: boolean;
  required: boolean;
  isValid: boolean;
  isDisabled: boolean;

  componentRefresh = false;

  selectedRole: Role;
  selectedRolePermissions: any[] = [];
  filteredRolePermissions: any[] = [];
  selectedRoleTypePermissions: any[] = [];

  selectedRoleId: string | number;

  constructor(
    private service: DirectoryRoleService,
    private uxService: UxService,
    private permissionGroupService: PermissionGroupService
  ) {
    super(service, uxService);
  }

  ngOnInit() {
    this.selectedRole = this.role;
    this.permissionGroupService.search().subscribe((page) => {
      this.groups = page.items;
      this.getRoleTypePermissions();
      this.getRolePermissions();
    });
  }

  ngOnChanges() {
    super.ngOnChanges();
    this.selectedRole = this.role;
  }

  onRoleChange(select: any) {
    if (select.value) {
      this.service.get(select.value).subscribe((item) => {
        this.selectedRole = item;
        this.getRoleTypePermissions();
        this.getRolePermissions();
      });
    }
  }

  roleTypeSelected($event: RoleType) {
    this.selectedRole.type = $event;
    this.getRoleTypePermissions();
    this.changed.emit($event);
  }

  getRoleTypePermissions() {
    this.selectedRoleTypePermissions = [];
    this.selectedRole.type.permissions.forEach((permission) => {
      this.groups.forEach((group) => {
        group.permissions.forEach((item) => {
          if (item.code === permission) {
            this.selectedRoleTypePermissions.push(item);
          }
        });
      });
    });
  }

  getRolePermissions() {
    this.selectedRolePermissions = [];
    this.filteredRolePermissions = [];
    this.selectedRole.permissions.forEach((permission) => {
      this.groups.forEach((group) => {
        group.permissions.forEach((item) => {
          if (item.code === permission) {
            this.selectedRolePermissions.push(item);
          }
        });
      });
    });
    this.filteredRolePermissions = this.selectedRolePermissions.filter(p => !this.selectedRole.type.permissions.includes(p.code));
  }

  save(message) {
    this.service.update(this.selectedRole.id, this.selectedRole).subscribe((role) => {
      this.selectedRole = role;
      this.selectedRoleId = role.id;
      this.getRoleTypePermissions();
      this.getRolePermissions();
      this.uxService.showInfo(`${message} Successfully`);
    });
  }

  validate(): boolean {
    return true;
  }
  complete(): Observable<any> | boolean {
    return true;
  }

  openDialog() {
    const dialogRef = this.uxService.openDialog(RolePermissionsDialogComponent);
    dialogRef.componentInstance.permissions = this.selectedRole.permissions;
    dialogRef.afterClosed().subscribe((permissions) => {
      if (permissions) {
        this.selectedRole.permissions = permissions;
        this.getRolePermissions();
        this.save('Updated');
      }
    });
  }

  onRemove(item): void {
    this.uxService.onConfirm().subscribe(() => {
      const index = this.selectedRole.permissions.indexOf(item.code);
      this.selectedRole.permissions.splice(index, 1);
      this.save('Deleted');
    });
  }

}
