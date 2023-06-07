import { Component, Injector, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { UxService } from 'src/app/core/services';
import { RoleService, WidgetDataService } from 'src/app/lib/oa/core/services';
import { CalendarEvent } from 'src/app/lib/oa/insight/models/calendar-event.model';
import { CalendarDateComponent } from '../calendar-date/calendar-date.component';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';

@Component({
  selector: 'insight-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.css']
})
export class CalendarWidgetComponent extends InsightWidgetBaseComponent {

  date: Date = new Date();

  events: CalendarEvent[] = [];

  selectedMonthEvents: CalendarEvent[] = [];

  @ViewChild('calendar')
  calendar: CalendarDateComponent;

  headArray = [];
  constructor(injector: Injector) {
    super(injector);

    this.afterInitialization = () => {
      this.headArray = this.fields.map((c) => c.key);
    };
    this.afterProcessing = () => {
      this.populate(this.items);
      this.monthEvents();
    };
  }

  onDateChange(date) {
    this.date = date;
    this.monthEvents();
  }

  monthEvents() {
    this.selectedMonthEvents = [];
    this.events.forEach((event) => {
      if (moment(this.date).isSame(event.date, 'month')) {
        this.selectedMonthEvents.push(event);
      }
    });
    if (this.selectedMonthEvents && this.calendar) {
      this.calendar.setEventsToCalendar(this.selectedMonthEvents);
    }
  }

  populate(list) {
    this.events = [];
    list.forEach((item) => {
      if (item.date) {
        this.events.push(new CalendarEvent({
          label: item.label,
          date: item.date,
          hrs: item.hrs,
          areaCode: item.areaCode || item.childAreaCode
        }));
      }
    });
  }

}
