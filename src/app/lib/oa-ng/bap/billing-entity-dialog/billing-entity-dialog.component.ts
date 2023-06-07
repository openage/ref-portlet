import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { BillingEntity } from 'src/app/lib/oa/bap/models/billing-entity.model';
import { BillingEntityService } from 'src/app/lib/oa/bap/services/billing-entity.service';
import { AddressService } from 'src/app/lib/oa/core/services/address.service';
import { Task } from 'src/app/lib/oa/gateway/models';
import { TaskService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'bap-billing-entity-dialog',
  templateUrl: './billing-entity-dialog.component.html',
  styleUrls: ['./billing-entity-dialog.component.css']
})
export class BillingEntityDialogComponent implements OnInit {

  changes: {
    field: string;
    value: any;
    oldValue: any;
    text: string;
  }[] = [];

  @Input()
  label = 'Add/Edit Billing Entity';

  @Input()
  entity: BillingEntity;

  @Input()
  parentTask: Task;

  error = {
    gst: null
  };

  entityCopy: BillingEntity;

  constructor(
    private errorHandler: UxService,
    private taskService: TaskService,
    private addressService: AddressService,
    private entityService: BillingEntityService,
    public dialogRef: MatDialogRef<BillingEntityDialogComponent>,
    private uxService: UxService
  ) { }

  ngOnInit() {
    this.entityCopy = new BillingEntity(this.entity);
  }

  validate() {
    let errors = [];

    if (!this.entity.name) {
      errors.push(`Entity Name Required`);
    }

    if (!this.entity.gst) {
      errors.push(`GST Number Required`);
    }

    if (this.error.gst) {
      errors.push(this.error.gst);
    }

    return errors;
  }

  checkGst = (gst: string): Observable<string | null> => {
    const subject = new Subject<string | null>();
    this.entityService.get(this.entity.gst).subscribe((entity) => {
      if (entity) {
        subject.next('already exist');
      } else {
        subject.next(null);
      }
    }, (err) => {
      if (err.message === 'RESOURCE_NOT_FOUND') {
        subject.next(null);
      }
    });

    return subject.asObservable();
  }

  onGSTChange($event) {
    this.onChange($event, this.entityCopy.gst, 'gst', 'GST Number')
  }

  onNameChange($event) {
    this.onChange($event.target.value, this.entityCopy.name, 'name', 'Name')
  }

  onNavCodeChange($event) {
    this.onChange($event.target.value, this.entityCopy.navCode, 'navCode', 'Nav Code')
  }

  onChange(value, oldValue, field, text) {
    if (value && value !== oldValue) {
      const change = this.changes.find((change) => change.field === field);
      if (change) {
        change.value = value;
      } else {
        this.changes.push({ field: field, value: value, oldValue: oldValue, text: text });
      }
    } else {
      this.changes = this.changes.filter((change) => change.field !== field);
    }
  }

  onRequest() {

    let errors = this.validate();

    if (errors.length) {
      return this.uxService.showError(errors, { title: 'Check Your Submission!' });
    }

    let type = this.entity.id ? 'update' : 'create';

    const payload = {
      status: {
        code: "approved"
      },
      parent: {
        id: this.parentTask.id,
      },
      type: `billing|billingentity|${type}`,
      workflow: {
        code: `billing|billingentity|${type}`,
      },
      template: {
        code: `billing|billingentity|${type}`,
      },
      tags: ['finance', 'finance|billingentity', `finance|organization|${this.entity.organization.code}|billingentity`]
    }

    if (!this.changes.length) {
      this.errorHandler.showInfo(`Nothing to change`);
      return;
    }

    payload['meta'] = { changes: this.changes };
    if (type === 'update') {
      payload['entity'] = { id: this.entity.id, name: this.entity.name, type: 'billingentity' };
    } else if (type === 'create') {
      payload['meta'].changes.push({
        field: 'organization-code',
        value: this.entity.organization.code,
        oldValue: '',
        text: 'Organization Code'
      })
    }

    this.taskService.create(payload).subscribe((task: Task) => {
      this.dialogRef.close(this.entity);
    });
  }

  onPinChange(pinCode): void {
    this.addressService.get(pinCode).subscribe((address) => {
      if (address) {
        this.entity.address.pinCode = pinCode;
        this.entity.address.city = address.city;
        this.entity.address.state = address.state;
        this.entity.address.country = address.country;
        this.onChange(address.city, this.entityCopy.address.city, 'address-city', 'City');
        this.onChange(address.pinCode, this.entityCopy.address.pinCode, 'address-pinCode', 'Pin Code');
        this.onChange(address.state, this.entityCopy.address.state, 'address-state', 'State');
        this.onChange(address.country, this.entityCopy.address.country, 'address-country', 'Country');
      } else {
        this.onChange(pinCode, this.entityCopy.address.pinCode, 'address-pinCode', 'Pin Code');
      }
    });
  }
}
