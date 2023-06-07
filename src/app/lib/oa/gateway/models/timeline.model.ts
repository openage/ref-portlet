export class TimeLine {
  start: Date;
  finish: Date;
  reminder: Date;

  constructor(obj?: any) {
    if (!obj) { return; }
    this.start = obj.start;
    this.finish = obj.finish;
    this.reminder = obj.reminder;
  }
}
