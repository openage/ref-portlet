import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IUser } from 'src/app/lib/oa/core/models';
import { DirectoryRoleService, UserService } from 'src/app/lib/oa/directory/services';
import { Member } from 'src/app/lib/oa/gateway/models/member.model';
import { User } from 'src/app/lib/oa/gateway/models/user.model';

@Component({
  selector: 'gateway-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit, OnChanges {

  @Input()
  view = 'list';

  @Input()
  readonly = false;

  @Input()
  role: {
    name: string,
    code: string,
    searchParams?: any
  };

  @Input()
  values: Member[];

  @Input()
  value: any;

  @Input()
  options: any = {};

  @Input()
  type: 'organization' | 'project' | 'task' = 'task';

  @Input()
  isAgent: boolean;

  @Input()
  roleTypeCode: string | string[];

  @Output()
  changed: EventEmitter<Member[]> = new EventEmitter();

  @Output()
  selected: EventEmitter<Member> = new EventEmitter();

  memberCtrl = new FormControl();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;

  filteredUsers: User[];

  isEditing = false;
  api: any

  constructor(
    public users: UserService,
    public roles: DirectoryRoleService
  ) {
  }
  ngOnInit(): void {
    this.values = this.values || [];
    this.options = this.options || {};
    this.view = this.view || this.options.view || 'list';
    this.api = this.type === 'project' ? this.roles : this.users
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.values?.currentValue?.length) {
      this.values = this.values.sort((memberA, memberB) => (memberA?.user?.profile?.firstName > memberB?.user?.profile?.firstName ? 1 : -1))
    }

    let newValue = changes.value?.currentValue;
    if (newValue) {
      if (typeof newValue === 'string') {
        this.value = this.values.find(i => i.user.email === newValue || i.user.code === newValue || i.user.id === newValue)
      } else if (!newValue.user) {
        this.value = this.values.find(i => i.user.email === newValue.email || i.user.code === newValue.code || i.user.id === newValue.id)
      }
    }
  }

  onSelect(item: Member): void {

    if (this.value && this.value.user && this.value.user.id === item.user.id) {
      this.value = null;
    } else {
      this.value = item;
    }
    this.selected.emit(this.value);
  }

  detach(user: IUser) {
    let member = this.values.find((i) => i.user.email === user.email)

    if (member.roles.length > 1) {
      // let roleIndex = member.roles.indexOf(this.role.code)
      // member.roles.splice(roleIndex, 1);
      member.roles = [this.role.code]
      member['action'] = 'remove'
    } else {
      member.status = 'inactive';
    }

    this.changed.emit(this.values);
  }

  attach(role: any) {
    if (role) {
      let member = this.values.find((i) => i.user.role.id === role.id);

      if (!member) {
        member = new Member({
          user: { role: { id: role.id }, profile: role.profile },
          roles: [],
          status: 'active'
        });
      }

      member.roles = (member.roles || []);
      if ((this.role && this.role.code) || !member.roles.find((r) => this.role && (r === this.role.code))) {
        member.roles.push(this.role.code);
      }
      this.values.push(member);

      this.changed.emit(this.values);
    }
  }

}
