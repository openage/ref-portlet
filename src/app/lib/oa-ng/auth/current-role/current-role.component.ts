import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Role } from 'src/app/lib/oa/directory/models';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';

@Component({
  selector: 'auth-current-role',
  templateUrl: './current-role.component.html',
  styleUrls: ['./current-role.component.css'],
})
export class CurrentRoleComponent implements OnInit {

  @Input()
  click: EventEmitter<void> = new EventEmitter();

  @Input()
  isImpersonateSession: Boolean = false

  role: Role;
  url: string;

  constructor(
    private auth: RoleService
  ) {
    auth.roleChanges.subscribe((role) => {
      this.role = role;
    });

    this.auth.impersonateChanges.subscribe(result => {
      this.isImpersonateSession = result
    })
  }

  ngOnInit() {
    this.role = this.auth.currentRole();
    if (this.role.employee) {
      const profile = this.role.employee ? this.role.employee.profile : null;
      if (profile && profile.pic && (profile.pic.url || profile.pic.thumbnail)) {
        this.url = profile.pic.url || profile.pic.thumbnail;
      }
    }
  }

  onClick() {
    this.click.emit();
  }

  getLogo(): string {
    if (this.role.organization.logo && this.role.organization.logo.url) {
      return this.role.organization.logo.url;
    } else if (this.role.organization.type === 'supplier') {
      return `/assets/images/${this.role.organization.type}/default.png`;
    }
  }
}
