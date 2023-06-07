import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { Plan } from 'src/app/lib/oa/bap/models/plan.model';
import { Subscription } from 'src/app/lib/oa/bap/models/subscription.model';
import { SubscriptionService } from 'src/app/lib/oa/bap/services/subscription.service';
import { Organization } from 'src/app/lib/oa/directory/models';

@Component({
  selector: 'bap-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit, OnChanges {

  isProcessing = false;

  @Input()
  subscription: Subscription;

  @Input()
  organization: Organization;

  @Output()
  submit: EventEmitter<Subscription> = new EventEmitter<Subscription>();

  constructor(
    private uxService: UxService,
    private subscriptionService: SubscriptionService
  ) {
    this.subscription = new Subscription();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.subscription = new Subscription(this.subscription);
  }

  ngOnInit() {
  }

  onPlanChange($event: Plan) {
    this.subscription.plan = $event;
  }

  private _subscriptionName(subscription) {
    const rateOfInterest = 10;
    const realisedAmount = subscription.amount + (subscription.amount * (rateOfInterest / 100) * (subscription.duration / 365));

    let level = 2;
    if (realisedAmount === 0) {
      level = 0;
    } else if (realisedAmount > 7000000) {
      level = 3;
    } else if (realisedAmount < 1515000) {
      (
        level = 1
      );
    }
    return `level-${level}`;
  }

  onSubmit() {

    if (!this.subscription.plan) {
      return this.uxService.handleError('Plan Required!');
    } else if (!this.subscription.duration) {
      return this.uxService.handleError('Duration Required!');
    }

    this.isProcessing = true;
    const payload = {
      ...this.subscription,
      // name: this._subscriptionName(this.subscription),
      organization: { code: this.organization.code }
    };

    if (this.subscription.id) {
      this.subscriptionService.update(this.subscription.id, payload).subscribe((item: Subscription) => {
        this.submit.emit(item);
        this.isProcessing = false;
        this.uxService.showInfo('Credit Policy Successfully Updated!');
      }, (err) => this.isProcessing = false);
    } else {
      payload.status = 'draft';
      this.subscriptionService.create(payload).subscribe((item: Subscription) => {
        this.submit.emit(item);
        this.isProcessing = false;
        this.uxService.showInfo('Credit Policy Successfully Created!');
      }, (err) => {
        this.isProcessing = false;
      });
    }
  }

}
