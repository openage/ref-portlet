import { Component, Input, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/core/services/constant.service';

@Component({
  selector: 'oa-no-data-found',
  templateUrl: './no-data-found.component.html',
  styleUrls: ['./no-data-found.component.css']
})
export class NoDataFoundComponent implements OnInit {

  @Input()
  value: any;

  @Input()
  code: string;

  @Input()
  message = 'No Data Found';

  @Input()
  class: string;

  @Input()
  icon: string;

  @Input()
  actions: any[];

  constructor(
    private constantService: ConstantService
  ) { }

  ngOnInit() {

    if (!(this.code || this.value)) {
      return;
    }

    if (!this.code && this.value) {
      if (typeof this.value === 'string') {
        this.code = this.value;
      } else {
        this.code = this.value.code
      }

    }

    let value = this.constantService.errors.get(this.code);
    if (value) {
      this.value = value;
    }

    if (!this.value) { return; }

    this.message = this.value.message || this.message;
    this.icon = this.value.icon || this.icon;
    this.class = this.value.class || this.class;
    this.actions = this.value.actions || this.actions;
  }
}
