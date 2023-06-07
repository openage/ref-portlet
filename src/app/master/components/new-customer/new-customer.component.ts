
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NavService, UxService } from 'src/app/core/services';
import { ErrorService } from 'src/app/core/services/error.service';
import { ThumbnailSelectorComponent } from 'src/app/lib/oa-ng/drive/thumbnail-selector/thumbnail-selector.component';
import { BillingEntity } from 'src/app/lib/oa/bap/models/billing-entity.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services';
import { Entity, ErrorModel, Pic } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { AddressService } from 'src/app/lib/oa/core/services/address.service';
import { Link } from 'src/app/lib/oa/core/structures';
import { Organization, Profile, Role } from 'src/app/lib/oa/directory/models';
import { Task } from 'src/app/lib/oa/directory/models/task.model';
import { EmployeeService, OrganizationService } from 'src/app/lib/oa/directory/services';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { GatewayOrganizationService } from 'src/app/lib/oa/gateway/services/organization.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.css']
})
export class NewCustomerComponent implements OnInit, OnDestroy {

  isProcessing = false;

  organization: Organization;
  profile: Profile;
  isCurrent = true;
  page: Link;

  type: string;

  isOrgExist = false;

  error: ErrorModel;

  // error = {
  //   gst: '',
  //   name: '',
  //   email: '',
  //   phone: ''
  // };

  billingEntity: BillingEntity = new BillingEntity({
    address: {},
    organization: {}
  });

  done = true;

  role: Role;

  progressTaskId: string;

  constructor(
    private addressService: AddressService,
    private orgService: OrganizationService,
    private roleService: RoleService,
    private uxService: UxService,
    private errorService: ErrorService,
    private navService: NavService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.type = this.route.snapshot.data.type;
    this.navService.register(`/master/${this.type}s/new`, this.route, (isCurrent, params) => {
      this.isCurrent = true;
      if (this.isCurrent) {

        this.setContext();

        this.organization = new Organization({
          status: 'draft',
          type: this.type,
          meta: {
            'direct/astra': 'direct'
          }
        });
        this.profile = this.roleService.currentUser().profile;
        this.checkOrg();
      }
    }).then((link) => this.page = link);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.uxService.reset();
  }

  setContext() {
    this.uxService.setContextMenu([{
      helpCode: this.page.meta.helpCode
    }, 'close']);

  }

  checkOrgName = (name: string): Observable<string | null> => {
    const subject = new Subject<string | null>();
    this.orgService.search({ name, fullMatch: true }, { limit: 1 }).subscribe((page) => {
      if (page.items && page.items.length) {
        subject.next('already exist');
      } else {
        subject.next(null);
      }
    });

    return subject.asObservable();
  }

  checkOrg() {
    const code = this.makeid(6);
    this.orgService.post({ code }, 'isAvailable').subscribe((response) => {
      if (response.isAvailable) {
        this.organization.code = code;
      } else {
        this.organization.code = response.available;
      }
    }, (err) => {
      this.uxService.handleError(err.message);
    });
  }

  checkPhoneOrEmail = (value: string): Observable<string | null> => {
    const subject = new Subject<string | null>();
    this.roleService.exists(`${value}`).subscribe((result) => {
      if (result.exists) { subject.next('already exist'); } else { subject.next(null); }
    });
    return subject.asObservable();
  }

  makeid(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toLocaleLowerCase();
  }

  tripSpace() {
    this.organization.name = this.organization.name.replace(/^[ ]+|[ ]+$/g, '');
  }

  validate(): boolean {
    const errors = [];
    if (!this.organization.name) {
      errors.push(this.errorService.get('CUSTOMER_NAME_REQUIRED'));
    }
    if (!this.organization.email) {
      errors.push(this.errorService.get('CUSTOMER_EMAIL_REQUIRED'));
    }
    if (!this.organization.phone) {
      errors.push(this.errorService.get('CUSTOMER_PHONE_REQUIRED'));
    }

    if (this.error) {
      errors.push(this.error);
    }

    if (errors.length) {
      this.uxService.showError(errors);
    }

    return !!errors.length;
  }

  onCreate() {
    if (!this.validate()) { return; }

    let roleCode = 'normal';
    switch (this.type) {
      case 'supplier':
        roleCode = 'pricing-agent';
        break;
      case 'customer':
        roleCode = 'sales-agent';
        break;
    }

    this.isProcessing = true;
    this.roleService.newRole(this.profile, 'employee', this.organization, roleCode).subscribe((role) => {
      this.role = role;
      this.progressTaskId = this.role.organization.task.id as any;
    }, (err) => {
      this.isProcessing = false;
    });
  }

  onDone(value) {
    this.isProcessing = false;
    this.progressTaskId = undefined;
    this.uxService.showSuccess('Customer Onboard Successfully',
      `You clicked the button to navigate ${this.type} detail`, { timer: 5000 }).subscribe((result) => {
        if (result) {
          this.navService.goto(`/master/${this.type}s/${this.role.organization.code}`);
        } else {
          this.navService.goto(`/master/${this.type}s`);
        }
      });
  }

  onError(value) {
    this.isProcessing = false;
    this.progressTaskId = undefined;
  }

  openThumbnailSelector() {
    const dialogRef = this.dialog.open(ThumbnailSelectorComponent, {
      width: '500px',
    });

    dialogRef.componentInstance.cropRatio = 1 / 1;
    dialogRef.componentInstance.okLabel = 'Save';
    dialogRef.componentInstance.dialogTitle = 'Select Logo';
    dialogRef.componentInstance.size = 1;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.organization.logo = new Pic({ url: result });
      }
    });
  }

  // onAddressChange() {
  //   this.addressService.get(this.organization.address.pinCode).subscribe((address) => {
  //     if (address) {
  //       this.organization.address.city = address.city;
  //       this.organization.address.district = address.district || address.city;
  //       this.organization.address.state = address.state;
  //       this.organization.address.country = address.country;
  //     }
  //   });
  // }

}
