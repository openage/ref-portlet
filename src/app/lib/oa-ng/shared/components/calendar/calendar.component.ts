import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { UxService } from 'src/app/core/services';

class Day {
  date: Date;
  isCurrent = true;
  status: string;
  events: any[] = [];

  constructor(obj?: any) {
    this.date = obj.date;
    this.isCurrent = obj.isCurrent;
    this.status = obj.status;

    if (obj.events && obj.events.length) {
      // this.events = obj.events.map((e) => new DayItem(e));
    }
  }
}

// eslint-disable-next-line max-classes-per-file
@Component({
  selector: 'oa-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnChanges {

  @Input()
  month: Date;

  @Input()
  events: any[] = [];

  @Input()
  options: {
    hideMonth?: boolean,
    hideNavigation?: boolean,
  } = {
      hideMonth: false,
      hideNavigation: false
    };

  @Input()
  legends: {
    label: string,
    status: string
  }[] = [];

  dateForm: UntypedFormGroup;

  momentMonth = moment();

  isReserved = null;

  days: Day[];

  @Output()
  dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  @Output()
  select: EventEmitter<any> = new EventEmitter<Date>();

  isSelectDay = false;

  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public uxService: UxService
  ) {
    this.initDateRange();
    this.momentMonth = moment(this.month);
  }

  initDateRange() {
    return (this.dateForm = this.fb.group({
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required]
    }));
  }

  ngOnChanges() {
    this.momentMonth = moment(this.month);
    this.createCalendar();
    this.events.forEach((item) => {
      const day = this.days.find((d) => moment(d.date).isSame(item.date, 'day'));
      if (day) {
        day.events = day.events || [];
        day.events.push(item);
        day.status = item.status;
      }
    });
  }

  createCalendar() {
    const firstMonthDay = this.momentMonth.startOf('M');
    const days = Array.apply(null, { length: this.momentMonth.daysInMonth() })
      .map(Number.call, Number)
      .map((n) => {
        return new Day({
          date: moment(firstMonthDay).add(n, 'd').toDate(),
          isCurrent: true
        });
      });

    for (let n = 0; n < firstMonthDay.weekday(); n++) {
      days.unshift(new Day({
        date: moment(firstMonthDay).subtract(n + 1, 'd').toDate(),
        isCurrent: false
      }));
    }

    const lastMonthDay = this.momentMonth.endOf('M');

    for (let m = 0; m < 6 - lastMonthDay.weekday(); m++) {
      days.push(new Day({
        date: moment(lastMonthDay).add(m, 'd').toDate(),
        isCurrent: false
      }));
    }
    this.days = days;
  }

  nextMonth() {
    this.momentMonth = this.momentMonth.add(1, 'M');
    this.createCalendar();
    this.dateChange.emit(this.momentMonth.toDate());
  }

  previousMonth() {
    this.momentMonth = this.momentMonth.subtract(1, 'M');
    this.createCalendar();
    this.dateChange.emit(this.momentMonth.toDate());
  }

  isToday(date) {
    return moment().isSame(date, 'date');
  }

  isSelected(day) {
    if (!day) {
      return false;
    }
    const dateFromMoment = moment(this.dateForm.value.dateFrom, 'MM/DD/YYYY');
    const dateToMoment = moment(this.dateForm.value.dateTo, 'MM/DD/YYYY');
    if (this.dateForm.valid) {
      return (
        dateFromMoment.isSameOrBefore(day) && dateToMoment.isSameOrAfter(day)
      );
    }
    if (this.dateForm.get('dateFrom').valid) {
      return dateFromMoment.isSame(day);
    }
  }

  // selectDay(items) {
  //   this.isSelectDay = true;
  //   items.forEach((event) => {
  //     const day = this.days.find((d) => d.date.isSame(event.date, 'day'));
  //     if (day) {
  //       day.items = day.items || [];
  //       day.items.push(event);
  //     }
  //   });
  // }

  onSelect(day) {
    this.select.emit(day);
  }

  // openDialog(day): void {
  //   const dialogRef = this.uxService.openDialog(CalenderDayDetailComponent, {
  //     width: '260px',
  //   });

  //   const instance = dialogRef.componentInstance
  //   instance.event = day.item;
  // }
}
