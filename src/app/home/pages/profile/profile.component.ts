import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UxService } from 'src/app/core/services/ux.service';
import { NavService } from 'src/app/core/services';
import { EmployeeDetailsComponent } from 'src/app/master/components/employee-details/employee-details.component';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Link } from 'src/app/lib/oa/core/structures';
import { Employee } from 'src/app/lib/oa/directory/models/employee.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('details')
  employeeDetails: EmployeeDetailsComponent;

  code = 'my';
  isEmployee = true;
  uploader = false;

  isCurrent = true;
  page: Link;
  readonly = true;

  constructor(
    private auth: RoleService,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) {
    // if(this.auth.hasPermission('organization.supervisor') || this.auth.hasPermission('organization.admin')){
    //   this.readonly = false
    // }
  }

  ngOnInit() {
    this.navService.register('/home/profile', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  onFetch($event: Employee) {
    this.uxService.setEntity({
      id: $event.id,
      type: 'z',
      name: `${$event.profile.firstName} ${$event.profile.lastName || ''}`.trim()
    });

    this.navService.setLabel(this.page, `${$event.profile.firstName} ${$event.profile.lastName || ''}`);
  }

  setContext() {
    this.uxService.setContextMenu([{
      helpCode: this.page.meta.helpCode
    }, 'close']);
  }
}
