import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { Plan } from 'src/app/lib/oa/bap/models/plan.model';
import { Subscription } from 'src/app/lib/oa/bap/models/subscription.model';
import { SubscriptionService } from 'src/app/lib/oa/bap/services/subscription.service';
import { Entity } from 'src/app/lib/oa/core/models';
import { Organization } from 'src/app/lib/oa/directory/models';
import { Change } from 'src/app/lib/oa/gateway/models/change.model';
import { Task } from 'src/app/lib/oa/gateway/models/task.model';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { PlanPickerComponent } from '../plan-picker/plan-picker.component';

@Component({
  selector: 'app-subscription-dialog',
  templateUrl: './subscription-dialog.component.html',
  styleUrls: ['./subscription-dialog.component.css']
})
export class SubscriptionDialogComponent implements OnInit {

  @ViewChild('selector') planSelector: PlanPickerComponent;

  isProcessing = false;

  subscription: Subscription = new Subscription({
    interval: 'day',
    status: 'draft'
  });

  @Input()
  task: Task;

  @Input()
  entity: Entity;

  @Input()
  organization: Organization;

  @Input()
  activeSubscription: Subscription;

  changes: Change[] = [];

  constructor(
    private api: SubscriptionService,
    private taskService: TaskService,
    private uxService: UxService,
    public dialogRef: MatDialogRef<SubscriptionDialogComponent>
  ) { }

  ngOnInit() {
  }

  setChange(value, oldValue, field, text) {
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

  onPlanChange($event: Plan) {
    this.subscription.plan = $event;
    this.subscription.amount = $event.amount.max || $event.amount.min;
    this.setChange(this.subscription.amount, this.activeSubscription?.amount, 'amount', 'Amount');
    this.setChange(this.subscription.plan.code, this.activeSubscription?.plan?.code, 'plan-code', 'Plan Code');
    this.setChange(this.subscription.plan.name, this.activeSubscription?.plan?.name, 'plan-name', 'Plan Code');
  }

  onAmountChange($event: any): void { // checking for plan change

    let amount = $event.target.value
    if (amount <= 0) { return; }
    amount = isNaN(amount) ? parseFloat(amount.split(',').join('')) : amount;
    const plan = this.planSelector.items.find((item) => item.amount.min < amount && item.amount.max >= amount);
    if (!plan) {
      this.uxService.showInfo('Please enter valid credit amount', 'Credit Amount');
      if (this.subscription.plan) {
        this.onPlanChange(this.subscription.plan);
      } else {
        this.subscription.amount = 0;
      }
      return;
    }
    if (!this.subscription.plan || plan.id !== this.subscription.plan.id) {
      this.onPlanChange(plan);
    }
    this.subscription.amount = amount;
    this.setChange(this.subscription.amount, this.activeSubscription?.amount, 'amount', 'Amount');
  }

  onSubmit() {
    if (!this.changes || !this.changes.length) {
      return this.uxService.handleError('Nothing to update');
    } else if (!this.subscription.plan) {
      return this.uxService.handleError('Plan Required!');
    } else if (!this.subscription.duration) {
      return this.uxService.handleError('Duration Required!');
    }
    this.createSubscription(this.subscription);
  }

  createSubscription(subscription: Subscription) {
    this.isProcessing = true;
    const payload = {
      ...subscription,
      organization: { code: this.organization.code }
    };
    this.api.create(payload).subscribe((item) => {
      if (this.task && this.task.id && (this.task.currentStatus && this.task.currentStatus.code !== 'active')) {
        this.updateTask(item);
      } else {
        this.createTask(item);
      }
    }, (err) => {
      this.isProcessing = false;
    });
  }

  updateTask(subscription) {
    const payload = {
      meta: { ...this.subscription.meta, subscription }
    };
    this.taskService.update(this.task.id, payload).subscribe((task) => {
      this.dialogRef.close(subscription);
      this.isProcessing = false;
    }, (err) => {
      this.isProcessing = false;
    });
  }

  createTask(subscription) {
    try {
      const taskModel = {
        template: {
          code: `bap|credit-policy`
        },
        meta: {
          changes: this.changes,
          subscription: subscription
        },
        parent: this.task.id,
        entity: { id: subscription.id, type: 'subscription', name: subscription.plan.name },
        type: `bap|credit-policy`,
        tags: ['finance', 'finance|subscriptions', 'finance|creditPolicy'],
      };
      this.taskService.create(taskModel).subscribe((item) => { }, (error) => { });
    } finally {
      this.isProcessing = false;
      this.dialogRef.close(subscription);
    }
  }
}
