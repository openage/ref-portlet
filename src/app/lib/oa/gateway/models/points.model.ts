export class Points {
  velocity: number;
  planned: number;
  burnt: number;

  backlog: number;
  days: number;

  support: number;
  management: number;

  constructor(obj?: any) {
    if (!obj) { return; }
    this.backlog = obj.backlog || 0;
    this.burnt = obj.burnt || 0;
    this.planned = obj.planned || 0;
    this.velocity = obj.velocity || 0;
    this.days = obj.days || 0;
    this.support = obj.support || 0;
    this.management = obj.management || 0;
  }
}
