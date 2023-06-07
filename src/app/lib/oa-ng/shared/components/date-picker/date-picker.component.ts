import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { DateService } from 'src/app/lib/oa/core/services/date.service';

// import { FormControl } from '@angular/forms';
// import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
// import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TimeLine } from 'src/app/lib/oa/gateway/models/timeline.model';
import { InputOptions } from '../../models/input-options.model';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'LL',
//   },
//   display: {
//     dateInput: 'LL',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
@Component({
  selector: 'oa-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  // providers: [
  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  //   },

  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // ],
})
export class DatePickerComponent implements OnInit, OnChanges {

  @Input()
  config: any;

  @Input()
  readonly: boolean;

  @Input()
  view: 'date' | 'inline' | 'day' | 'week' | 'month' | 'range' | 'readonly' | 'icon' | 'weekAndData' = 'date';

  @Input()
  placeholder: string;

  @Input()
  label: string;

  @Input()
  required = false;

  @Input()
  value: string | Date;

  @Input()
  populateData: any;

  @Input()
  minDate: Date;

  @Input()
  maxDate: Date;

  @Input()
  range: TimeLine;

  @Input()
  format = 'DD-MM-YYYY';

  @Input()
  disabled = false;

  @Input()
  isReset = false;

  @Input()
  showLabel = true;

  @Input()
  options: InputOptions | any = {
    inline: false,

  };

  @Input()
  overdue: boolean = false

  @Output()
  change: EventEmitter<Date | TimeLine> = new EventEmitter();

  @Output()
  select: EventEmitter<Date> = new EventEmitter();

  @ViewChild('picker')
  picker: MatDatepicker<Date>;

  @Output()
  selected: EventEmitter<boolean> = new EventEmitter();

  @Output()
  onShowPrevious: EventEmitter<Date[]> = new EventEmitter();

  @Output()
  onShowNext: EventEmitter<Date[]> = new EventEmitter();

  @ViewChild('inputContainer', { static: false })
  inputContainer: ElementRef;

  dates: Date[] = [];

  month: string;
  date: string;

  isEditing = true;

  now = new Date();

  nativeElement: ElementRef;
  isSelected = false;

  // value: FormControl;

  constructor(
    private dateService: DateService
  ) { }

  ngOnInit() {
    this.config = this.config || {};

    this.isEditing = !!this.value;

    //   // const date = this.dateService.parse(this.date);
    //   // this.setDates(date);

    //   // this.date = this.dates.find((i) => this.dateService.compare(i, date, 'date'));
    //   // this.date = moment(this.date).format('YYYY-MM');
  }

  ngOnChanges(changes?: SimpleChanges) {
    if (this.isReset === true) {
      this.value = null;
    }

    if (this.range) {
      this.view = 'range';
      return;
    }

    if (typeof this.value === 'string') {
      this.value = this.dateService.date(this.value).toDate();
    }

    if (changes.value || changes.view) {
      switch (this.view) {
        case 'week':
          this.setWeek(this.value);
          break;

        case 'weekAndData':
          this.setWeek(this.value);
          break;

        case 'month':
          this.month = this.dateService.date(this.value).toString('month');
          break;

        case 'day':
          this.value = this.value || new Date();
          break;

        case 'date':
        case 'inline':
          if (this.value) {
            this.date = this.dateService.date(this.value).toString(this.format);
          }
          break;
      }
    }
  }
  ngAfterViewInit() {
    if (this.inputContainer) {
      this.nativeElement = this.inputContainer.nativeElement;
      this.options = this.options && this.options instanceof InputOptions ?
        this.options :
        new InputOptions(this.options);
    }
  }

  openPicker() {
    if (this.readonly) { return; }
    this.picker.open();
    this.picker.startAt = new Date(this.value || this.now);
  }

  configure() {
    this.config = this.config || {};
    this.view = this.config.view || this.view;
  }

  setWeek(date: Date) {
    this.dates = this.dateService.inWeek(date);
    const lastDate = this.dates[this.dates.length - 1];
    this.month = this.dateService.toString(lastDate, 'month');
  }

  setSevenData(date) {
    this.dates = this.dateService.weekFromNow(date);
  }

  showPreviousSeven() {
    const first = this.dates[0]
    this.dates = this.dateService.weekFromNow(moment(first).subtract(7, 'd').toDate());
    this.onShowPrevious.emit(this.dates)
  }

  showNextSeven() {
    const last = this.dates[this.dates.length - 1]
    this.dates = this.dateService.weekFromNow(moment(last).add(1, 'd').toDate());
    this.onShowNext.emit(this.dates)
  }

  getPopulateData(date: Date) {
    let key = moment(date).format('YYYYMMDD')
    let value
    if (this.populateData) {
      value = this.populateData[key]
    }
    return value || 0
  }

  isCurrent(item) {
    if (moment(moment(item).format('YYYYMMDD')).isSame(moment(this.value).format('YYYYMMDD'))) {
      return true;
    }
    return false
  }

  click(date: Date) {
    this.value = date;
    this.change.emit(date);
    this.select.emit(date);
  }

  showNextWeek() {
    const lastDate = this.dates[this.dates.length - 1];
    this.setWeek(this.dateService.nextDay(lastDate));
  }

  showPreviousWeek() {
    this.setWeek(this.dateService.previousDay(this.dates[0]));
  }

  showNextMonth() {
    this.value = moment(this.value).add(1, 'month').toDate();
    this.select.emit(this.value);
    this.change.emit(this.value);
  }

  showPreviousMonth() {
    this.value = moment(this.value).subtract(1, 'month').toDate();
    this.change.emit(this.value);
    this.select.emit(this.value);
  }

  showNextDate() {
    this.value = moment(this.value).add(1, 'day').toDate();
    this.select.emit(this.value);
    this.change.emit(this.value);
  }

  showPreviousDate() {
    this.value = moment(this.value).subtract(1, 'day').toDate();
    this.change.emit(this.value);
    this.select.emit(this.value);
  }

  updated($event) {
    let date = this.getDate($event);
    this.value = date;
    let change = { value: { currentValue: $event } }
    this.ngOnChanges((change as any));
    this.change.emit(date);
    this.select.emit(date);
  }

  updatedStart($event) {
    this.range.start = this.getDate($event);
    this.change.emit(this.range);
  }

  updatedFinish($event) {
    this.range.finish = this.getDate($event);
    this.change.emit(this.range);
  }

  getDate($event) {
    if ($event.value) {
      return $event.value;
    }

    if ($event.currentTarget && $event.currentTarget.value) {
      return moment($event.currentTarget.value);
    }

    return null;
  }

}
