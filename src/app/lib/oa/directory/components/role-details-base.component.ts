import { ErrorHandler, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, Directive } from '@angular/core';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Role } from '../models';
import { DirectoryRoleService } from '../services';

@Directive()
export abstract class RoleDetailsBaseComponent extends DetailBase<Role> implements OnInit, OnChanges {

  @Input()
  code: string;

  @Input()
  readonly: boolean;

  complete: EventEmitter<any> = new EventEmitter();

  constructor(
    api: DirectoryRoleService,
    private errorHandler: ErrorHandler

  ) {
    super({ api, errorHandler });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.code) {
      return;
    }
    this.get(this.code).subscribe((data) => {
      this.properties = new Role(data);
      this.checkPermissions(this.properties.permissions);
    });
  }

  checkPermissions(permissions) {
    if (permissions.length) {
      permissions.forEach((permission) => {

      });
    }
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

  onSupervisorSet($event) {
    this.properties.supervisor = new Role($event)
  }

}
