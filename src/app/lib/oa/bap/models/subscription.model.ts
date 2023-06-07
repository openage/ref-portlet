import { ModelBase } from '../../core/models/model-base.model';
import { Organization } from './organization.model';
import { Plan } from './plan.model';

export class Subscription extends ModelBase {

  name: string;
  duration: number;
  interval: string;

  start: Date;
  end: Date;

  amount: number;
  canceledAt: Date;
  status: string;

  plan: Plan;
  meta: any;

  remainingDuration: number;

  organization: Organization;

  constructor(obj?: any) {
    super(obj);
    if (!obj) {
      return;
    }

    this.duration = obj.duration;
    this.interval = obj.interval;

    this.amount = obj.amount;

    this.remainingDuration = obj.remainingDuration;

    if (obj.plan) {
      this.plan = new Plan(obj.plan);
    }

    if (obj.organization) {
      this.organization = new Organization(obj.organization);
    }
  }

}
