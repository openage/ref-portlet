import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UxService } from 'src/app/core/services/ux.service';
import { NavService } from 'src/app/core/services';
import { PageBaseComponent } from 'src/app/lib/oa/core/components/page-base.component';
import { Entity } from 'src/app/lib/oa/core/models';
import { LocalStorageService, RoleService } from 'src/app/lib/oa/core/services';
import { Folder } from 'src/app/lib/oa/drive/models';
import { Conversation } from 'src/app/lib/oa/send-it/models';
import { Employee } from 'src/app/lib/oa/directory/models/employee.model';
import { EmployeeDetailsComponent } from '../../components/employee-details/employee-details.component';
import { EmployeeRoleDetailsComponent } from '../../components/employee-role-details/employee-role-details.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent extends PageBaseComponent {
  @ViewChild('details')
  details: EmployeeDetailsComponent;

  @ViewChild('employeeRoleDetails')
  employeeRoleDetails: EmployeeRoleDetailsComponent;

  view: 'employee-details' | 'employee-role-details' = 'employee-role-details'

  readonly = false;
  uploader = false;
  code: string;

  conversation: Conversation;
  folder: Folder;

  constructor(
    private navService: NavService,
    private uxService: UxService,
    public auth: RoleService,
    private route: ActivatedRoute,
    private cache: LocalStorageService
  ) {
    super(navService, uxService, auth, route, cache);

    this.params.subscribe(params => {
      if (!this.isCurrent) {
        return;
      }

      this.code = params.get('code');

      this.entity = new Entity({ id: this.code, type: 'role' });
      this.conversation = new Conversation();
      this.conversation.entity = this.entity;
      this.folder = new Folder({ code: `role-${this.code}`, entity: this.entity });

      if (!this.isInitialized) {
        this.init();
      }
    });
  }

  init() {
    // this.setContext();
  }

  ngOnInit() {
    this.init();
  }

  onFetch($event: Employee) { }

  onSave() {
    const errors = this.employeeRoleDetails.roleDetails.getErrors();
    if (errors) {
      this.uxService.showError(errors);
    } else {
      this.employeeRoleDetails.roleDetails.save();
    }
  }

  setContext(context) {
    context.forEach((item) => {

    });
    return context;
  }
}
