import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { DetailBase, PermissionGroup } from 'src/app/lib/oa/core/structures';
import { RoleType } from '../models';
import { PermissionGroupService } from '../services';
import { RoleTypeService } from '../services/role-type.service';

@Directive()
export abstract class RoleTypeDetailsBaseComponent extends DetailBase<RoleType> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly: boolean;

  complete: EventEmitter<any> = new EventEmitter();

  groups: PermissionGroup[];

  constructor(
    api: RoleTypeService,
    private errorHandler: ErrorHandler,
    private permissionGroupService: PermissionGroupService

  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {
    this.permissionGroupService.search().subscribe((page) => {
      this.groups = page.items;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.code === 'new') {
      this.properties = new RoleType({});
    } else {
      this.get(this.code).subscribe((data) => {
        this.properties = new RoleType(data);
        this.checkPermissions(this.properties.permissions);
      });
    }
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
        this.properties.permissions.push(permission);
      }
    } else {
      if (this.checkIndex(permission) >= 0) {
        this.properties.permissions = this.removefromArray(this.properties.permissions, this.checkIndex(permission));
      }
    }
  }

  checkIndex(permission): number {
    let index;
    let i = 0;
    this.properties.permissions.forEach((item) => {
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

  check() {

    let validated = true;

    if (!this.properties.name) {
      validated = false;
      this.errorHandler.handleError('Name is required');
    }

    if (!this.properties.code) {
      validated = false;
      this.errorHandler.handleError('Code is required');
    }

    if (validated) {
      this.save(this.properties);
      if (this.code !== 'new') {
        this.errorHandler.handleError('Updated Successfully');
      } else {
        this.errorHandler.handleError('Saved Successfully');
      }
    }
  }
}
