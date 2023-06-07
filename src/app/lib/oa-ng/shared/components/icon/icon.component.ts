import { Input, SimpleChanges } from '@angular/core';
import { Component, OnInit, OnChanges } from '@angular/core';
import { ConstantService } from 'src/app/core/services/constant.service';

@Component({
  selector: 'oa-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnChanges {

  @Input()
  value: any;

  @Input()
  title: string;

  @Input()
  class: string;

  @Input()
  style: string;

  icon: any;

  constructor(
    private constantService: ConstantService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  init() {

    if (!this.value) {
      return;
    }

    let icon: any = {};
    if (typeof this.value === 'string') {
      if (this.value.startsWith('http')) {
        icon.url = this.value;
      } else if (this.value.startsWith('fa-')) {
        icon.fa = this.value.substring(3);
      } else if (this.value.startsWith('oa-')) {
        icon.oa = this.value.substring(3);
        this.class = this.class || 'x-md';
      } else if (this.value.startsWith('mat-')) {
        icon.mat = this.value.substring(4);
      } else {
        icon.mat = this.value;
        let item = this.constantService.icons.get(this.value);
        if (item) {
          this.title = item.title;
          icon = item;
        }
      }
    } else {
      icon = this.value;
    }

    this.icon = icon;
    this.title = this.title || icon.title;
  }

}
