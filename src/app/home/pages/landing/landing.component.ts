import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Pic } from 'src/app/lib/oa/core/models/pic.model';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { TenantService } from 'src/app/lib/oa/core/services/tenant.service';
import { Role, Tenant } from 'src/app/lib/oa/directory/models';
import { ReportType } from 'src/app/lib/oa/insight/models';
import { ReportTypeService } from 'src/app/lib/oa/insight/services/report-type.service';
import { CodeDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/code-dialog/code-dialog.component';
import { UxService } from 'src/app/core/services/ux.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  tenant: Tenant;
  role: Role;
  logo = new Pic({ url: 'assets/images/logo.png' });

  constructor(
    private auth: RoleService,
    private tenants: TenantService,
    private uxService: UxService
  ) {
    this.tenant = this.auth.currentTenant();
    this.role = this.auth.currentRole();
    this.auth.tenantChanges.subscribe((t) => this.tenant = t);
    this.auth.roleChanges.subscribe((r) => this.role = r);
  }

  ngOnInit() {
  }

  logout() {
    // this.auth.logout();
    // location.reload();
  }

  changeTenant() {
    this.uxService.openDialog(CodeDialogComponent).afterClosed().subscribe((code: string) => {
      if (!code) {
        return;
      }

      this.tenants.get(code).subscribe((i) => {
        if (!i) {
          this.uxService.handleError(`invalid code ${code}`);
        }
        this.auth.setTenant(i);
      });
    });
  }
}
