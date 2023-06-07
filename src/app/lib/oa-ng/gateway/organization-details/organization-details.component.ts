import { Component, Input } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { OrganizationDetailBaseComponent } from 'src/app/lib/oa/gateway/components/organization-detail.base.component';
import { Member } from 'src/app/lib/oa/gateway/models';
import { GatewayOrganizationService } from 'src/app/lib/oa/gateway/services/organization.service';

@Component({
  selector: 'gateway-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent extends OrganizationDetailBaseComponent {

  staticMembersCode = [
    { name: 'Pricing Agent', code: 'pricing-agent' },
    { name: 'Operator', code: 'operator' },
    { name: 'Sales Agent', code: 'sales-agent' },
    { name: 'Business Head', code: 'business-head' }
  ];

  commonMembers: any[] = [];

  constructor(
    uxService: UxService,
    orgService: GatewayOrganizationService
  ) {
    super(uxService, orgService);
    this.afterProcessing = () => {
      this.staticMembersCode.forEach((sMember) => {
        const gMember = this.properties.members.find((m) => m.roles.includes(sMember.code));
        if (gMember && gMember.status === 'active') {
          this.commonMembers.push({ member: new Member(gMember), name: sMember.name, code: sMember.code });
        } else if (!gMember) {
          this.commonMembers.push({ member: new Member({}), name: sMember.name, code: sMember.code });
        }
      });
    };
  }

}
