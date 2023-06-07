import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { UxService } from 'src/app/core/services';
import { RoleService, WidgetDataService } from 'src/app/lib/oa/core/services';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';


@Component({
  selector: 'insight-heat-map-widget',
  templateUrl: './heat-map-widget.component.html',
  styleUrls: ['./heat-map-widget.component.css']
})
export class HeatMapWidgetComponent extends InsightWidgetBaseComponent {

  date: Date = new Date();

  weeks = [];

  headArray = [];

  headWidth: number;

  days = [{ value: 'mon', labe: 'M' }, { value: 'tue', labe: 'T' }, { value: 'wed', labe: ' W' }, { value: 'thu', labe: ' T' }, { value: 'fri', labe: 'F' }, { value: 'sat', labe: 'S' }, { value: 'sun', labe: 'S' }];

  constructor(injector: Injector) {
    super(injector);

    // this.afterInitialization = () => {
    //   this.headArray = this.reportType.columns.map((c) => c.key);
    // };
    this.afterProcessing = () => {
      this.mapRfqToEvent(this.items);
      // this.monthEvents();
    };
  }

  // monthEvents() {
  //   this.selectedMonthEvents = [];
  //   this.events.forEach((event) => {
  //     if (moment(this.date).isSame(event.date, 'month')) {
  //       this.selectedMonthEvents.push(event);
  //     }
  //   })
  // this.calendar.setEventsToCalendar(this.selectedMonthEvents);
  // }

  mapRfqToEvent(items) {
    const newItesms = [];
    const maxWeek = moment().weeksInYear();
    // let end = date.endOf('year')
    // let maxWeek = moment(end).week()
    for (let i = 0; i < maxWeek; i++) {
      for (let j = 1; j < 8; j++) {
        let res;
        items.forEach((item) => {
          if (item.week === i && item.day === j) {
            res = item;
          }
        });
        if (res) {
          // newItesms.push(items.find(item => items.week === i && item.day === j))
          newItesms.push(res);
        } else {
          newItesms.push({
            week: i,
            day: j,
            label: 0
          });
        }
      }
    }
    items = newItesms;
    this.items = items;
    // this.events = []
    // holidays.forEach((item) => {
    //   if (item.date) {
    //     this.events.push(new HeatMapEvent({
    //       label: item.label,
    //       date: new Date(item.date),
    //     }))
    //   }
    // })

    const weeks = [];
    const headArray = [];
    let weekKey = items[0].week;
    headArray.push(weekKey);
    let week = {};
    items.forEach((item) => {
      if (item.week === weekKey) {
        week[this.getDay(item.day)] = this.getColor(parseInt(item.label));
        week[this.getDay(item.day) + 'value'] = parseInt(item.label).toString();
        week[this.getDay(item.day) + 'date'] = moment(new Date(new Date().getFullYear(), 0, (item.day + (Number(weekKey)) * 7))).subtract(2, 'days').format('MMMM Do YYYY');
      } else {
        weeks.push(week);
        weekKey = item.week;
        headArray.push(weekKey);
        week = {};
        week[this.getDay(item.day)] = this.getColor(parseInt(item.label));
        week[this.getDay(item.day) + 'value'] = parseInt(item.label).toString();
        week[this.getDay(item.day) + 'date'] = moment(new Date(new Date().getFullYear(), 0, (item.day + (Number(weekKey)) * 7))).subtract(2, 'days').format('MMMM Do YYYY');
      }
    });
    weeks.push(week);
    this.weeks = weeks;
    this.headWidth = Number(100 / this.weeks.length - 1);
    this.getHeadArray(headArray);
  }

  getDay(num) {
    switch (num) {
      case 1: return 'mon';
        break;
      case 2: return 'tue';
        break;
      case 3: return 'wed';
        break;
      case 4: return 'thu';
        break;
      case 5: return 'fri';
        break;
      case 6: return 'sat';
        break;
      case 7: return 'sun';
        break;
      default: return 'def';
    }
  }

  getColor(value) {
    if (value > 0 && value < 25) {
      return '#e6f1ff';
    }
    if (value >= 25 && value < 50) {
      return '#99c9ff';
    }
    if (value >= 50 && value < 75) {
      return '#0077ff';
    }
    if (value >= 75 && value < 100) {
      return '#004799';
    }
    if (value === 100) {
      return '#002147';
    }
    return '#e3e3e3';
  }

  getHeadArray(weeks) {
    const headArray = [];
    const monthList = {};
    let skip = 0;
    weeks.forEach((week) => {
      if (skip > 0) {
        skip = skip - 1;
      } else {
        const start = new Date(new Date().getFullYear(), 0, (1 + (Number(week)) * 7));
        const end = new Date(new Date().getFullYear(), 0, (7 + (Number(week)) * 7));
        if (end.getMonth() !== start.getMonth()) {
          headArray.push({ align: 'center', value: '' });
        } else {
          if (!monthList[end.getMonth()]) {
            const month = moment(start).format('MMM');
            headArray.push({ align: 'flex-end', value: month[0] });
            headArray.push({ align: 'center', value: month[1] });
            headArray.push({ align: 'start', value: month[2] });
            monthList[end.getMonth()] = true;
            skip = 2;
          } else {
            headArray.push({ align: 'center', value: '' });
          }
        }
      }
    });
    this.headArray = headArray;
  }

}
