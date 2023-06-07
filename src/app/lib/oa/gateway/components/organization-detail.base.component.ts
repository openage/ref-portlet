import { Input, OnChanges, OnInit, SimpleChanges, Directive } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Member, Organization, User } from '../models';
import { GatewayOrganizationService } from '../services/organization.service';

@Directive()
export class OrganizationDetailBaseComponent extends DetailBase<Organization> implements OnInit, OnChanges {

  @Input()
  code: string;

  afterProcessing: () => void;

  constructor(
    public uxService: UxService,
    public api: GatewayOrganizationService
  ) {
    super({
      api
    });
  }

  ngOnInit() {
    if (this.code) {
      this.get(this.code).subscribe((item) => {
        if (this.afterProcessing) { this.afterProcessing(); }
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onMemberSet(user, permission) {
    if (user && user.email) {
      const index = this.properties.members.findIndex((m) => m.roles.includes(permission));
      if (index >= 0) {
        this.properties.members[index].status = 'inactive';
      }
      this.properties.members.push(new Member({ roles: [permission], user: { email: user.email }, status: 'active' }));
      this.save();
    }
  }

}
