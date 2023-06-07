import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import * as moment from 'moment';
import { HeatMapEvent } from 'src/app/lib/oa/insight/models/heat-map.model';

@Component({
  selector: 'insight-heat-map-month',
  templateUrl: './heat-map-month.component.html',
  styleUrls: ['./heat-map-month.component.css']
})
export class HeatMapMonthComponent implements OnInit {

  selectedDate = moment();

  @Input()
  date: Date;

  @Input()
  events: HeatMapEvent[];

  dateForm: UntypedFormGroup;

  isReserved = null;

  collectionWeek = [];

  week = [];

  isSelectDay = false;

  constructor() { }

  ngOnInit() {
    // this.weekAry(this.events)
  }

}
