import { Component, ErrorHandler, OnInit } from '@angular/core';
import { SubscriptionListBaseComponent } from 'src/app/lib/oa/bap/components/subscription-list-base.component';
import { SubscriptionService } from 'src/app/lib/oa/bap/services/subscription.service';

@Component({
  selector: 'bap-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent extends SubscriptionListBaseComponent {

  constructor(api: SubscriptionService, errorHandler: ErrorHandler) {
    super(api, errorHandler);
  }

}
