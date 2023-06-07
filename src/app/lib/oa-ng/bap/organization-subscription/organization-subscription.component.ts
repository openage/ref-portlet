import { AfterViewInit, Component, EventEmitter, Inject, Injector, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { Subscription } from 'src/app/lib/oa/bap/models/subscription.model';
import { PlanService } from 'src/app/lib/oa/bap/services/plan.service';
import { SubscriptionService } from 'src/app/lib/oa/bap/services/subscription.service';
import { Entity } from 'src/app/lib/oa/core/models/entity.model';
import { Task } from 'src/app/lib/oa/gateway/models';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { TaskListComponent } from '../../gateway/task-list/task-list.component';
import { SubscriptionDialogComponent } from '../subscription-dialog/subscription-dialog.component';
import { SubscriptionListComponent } from '../subscription-list/subscription-list.component';

@Component({
  selector: 'bap-organization-subscription',
  templateUrl: './organization-subscription.component.html',
  styleUrls: ['./organization-subscription.component.css']
})
export class OrganizationSubscriptionComponent implements OnInit, AfterViewInit {
  @ViewChild('list')
  list: SubscriptionListComponent;

  @ViewChild('taskList')
  taskList: TaskListComponent;

  @Input()
  organization: any;

  @Input()
  task: Task;

  @Input()
  code: string;

  @Output()
  onUpdate: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[];


  columns: string[] = ['planName', 'amount', 'duration', 'date', 'status'];
  taskColumns: string[] = ['planName', 'amount', 'duration', 'date', 'actionItem'];

  constructor() {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
  }

  afterTaskUpdate() {
    this.onUpdate.emit();
  }

  setSubscriptions() {
    this.subscriptions = this.list.items || []
  }

  getErrors() {
    let errors = [];
    if (!this.subscriptions || !this.subscriptions.length) {
      errors.push(`Credit Policy is required.`);
    }
    return errors;
  }

}
