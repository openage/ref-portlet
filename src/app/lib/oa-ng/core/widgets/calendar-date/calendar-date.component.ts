import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { UxService } from 'src/app/core/services';
import { CalendarEvent } from 'src/app/lib/oa/insight/models/calendar-event.model';
import { CalenderDayDetailComponent } from '../calender-day-detail/calender-day-detail.component';

class Day {
  date: Date;
  status: 'enabled' | 'disabled' = 'enabled';
  events: CalendarEvent[];

  constructor(obj?: any) {
    this.date = obj.date;
    this.status = obj.status;

    if (obj.events && obj.events.length) {
      this.events = obj.events.map((e) => new CalendarEvent(e));
    }
  }
}

// eslint-disable-next-line max-classes-per-file
@Component({
  selector: 'insight-calendar-date',
  templateUrl: './calendar-date.component.html',
  styleUrls: ['./calendar-date.component.css']
})
export class CalendarDateComponent implements OnInit {
  selectedDate = moment();

  @Input()
  date: Date;

  @Input()
  view: 'month' | 'week' = 'month';

  @Input()
  events: CalendarEvent[];

  @Input()
  params: any[] = []

  dateForm: UntypedFormGroup;

  isReserved = null;

  daysArr: Day[];

  @Output()
  dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  isSelectDay = false;

  constructor(
    private fb: UntypedFormBuilder,
    public dialog: MatDialog,
    public uxService: UxService
  ) {
    this.initDateRange();
    this.selectedDate = moment(this.date);
  }

  initDateRange() {
    return (this.dateForm = this.fb.group({
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required]
    }));
  }

  ngOnInit() {
    this.selectedDate = moment(this.date);
    this.daysArr = this.createCalendar(this.selectedDate);
    this.setEventsToCalendar(this.events);
  }

  createCalendar(date) {
    switch (this.view) {
      case 'week':
        const days = Array.apply(null, { length: 7 })
          .map(Number.call, Number)
          .map((n) => {
            return new Day({
              date: moment(date).add(n, 'd'),
              status: 'enabled'
            });
          });
        return days
        break;
      case 'month':
        const firstMonthDay = moment(date).startOf('M');
        const day = Array.apply(null, { length: date.daysInMonth() })
          .map(Number.call, Number)
          .map((n) => {
            return new Day({
              date: moment(firstMonthDay).add(n, 'd'),
              status: 'enabled'
            });
          });

        for (let n = 0; n < firstMonthDay.weekday(); n++) {
          day.unshift(new Day({
            date: moment(firstMonthDay).subtract(n + 1, 'd'),
            status: 'disabled'
          }));

          return day;
          break;
        }
    }

  }
  nextMonth() {
    this.selectedDate.add(1, 'M');
    this.daysArr = this.createCalendar(this.selectedDate);
    this.dateChange.emit(this.selectedDate.toDate());
  }
  nextWeek() {
    this.selectedDate.add(7, 'days');
    this.daysArr = this.createCalendar(this.selectedDate);
    this.dateChange.emit(this.selectedDate.toDate());
  }

  previousMonth() {
    this.selectedDate.subtract(1, 'M');
    this.daysArr = this.createCalendar(this.selectedDate);
    this.dateChange.emit(this.selectedDate.toDate());
  }
  previousWeek() {
    this.selectedDate.subtract(7, 'days');
    this.daysArr = this.createCalendar(this.selectedDate);
    this.dateChange.emit(this.selectedDate.toDate());
  }

  todayCheck(day) {
    if (!day || !day.date || day.status !== 'enabled') {
      return false;
    }

    return moment().format('L') === day.date.format('L');
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

  setEventsToCalendar(events) {

    this.daysArr = this.createCalendar(this.selectedDate);

    events.forEach((event) => {

      const getEventDay = (d) => {
        return d.date.isSame(event.date, 'day');
      };

      const day = this.daysArr.find(getEventDay);

      if (day) {
        day.events = day.events || [];
        day.events.push(event);
      }

    });
  }

  selectDay(events) {
    this.isSelectDay = true;
    events.forEach((event) => {

      const getEventDay = (d) => {
        return d.date.isSame(event.date, 'day');
      };

      const day = this.daysArr.find(getEventDay);

      if (day) {
        day.events = day.events || [];
        day.events.push(event);
      }

    });
  }

  getHrsClass(event) {
    switch (true) {
      case event.hrs < 8:
        return 'pending'
      case event.hrs > 8:
        return 'extra'
      default:
        return 'complete'
    }
  }

  getFilters(day) {
    let filters = [];
    for (const key in this.params) {
      if (key !== 'roleId') continue;
      filters.push(
        { key: 'roleId', value: this.params[key] },
        { key: 'date', value: day.events[0].date }
      )
    }
    return filters
  }

  openDialog(day): void {
    if (day.events === undefined) {
      this.uxService.handleError('No Holiday Today');
      return;
    }

    let config: MatDialogConfig = { width: '70%' }
    const instance = this.uxService.openDialog(CalenderDayDetailComponent, config).componentInstance;
    instance.events = day.events;
    instance.filters = this.getFilters(day);
  }
}
