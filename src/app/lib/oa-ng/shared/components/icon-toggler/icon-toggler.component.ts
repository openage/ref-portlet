import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'oa-icon-toggler',
  templateUrl: './icon-toggler.component.html',
  styleUrls: ['./icon-toggler.component.css']
})
export class IconTogglerComponent implements OnInit, OnChanges {

  @Input()
  value: any;

  @Input()
  type: string;

  @Input()
  view: 'icon' | 'button' | 'select' | 'mini-fab' = 'icon';

  @Input()
  disabled = false;

  @Input()
  readonly = false;

  @Input()
  required = false;

  @Output()
  valueChange: EventEmitter<any> = new EventEmitter();

  @Output()
  changed: EventEmitter<any>; // obsolete

  @Input()
  items?: {
    label: string,
    icon: any,
    class?: string,
    code: any,
    index?: number
  }[] = [];

  selected: any;

  constructor() {
    this.changed = this.valueChange;
  }

  ngOnInit() { }
  ngOnChanges(changes: SimpleChanges): void {

    switch (this.type) {
      case 'expand':
      case 'expand-d':
        this.items = [{
          label: 'Expand',
          icon: 'mat-keyboard_arrow_down',
          code: false
        }, {
          label: 'Collapse',
          icon: 'mat-keyboard_arrow_up',
          code: true
        }];
        // this.value = this.value || false;
        break;

      case 'expand-r':
        this.items = [{
          label: 'Expand',
          icon: 'mat-chevron_right',
          code: false
        }, {
          label: 'Collapse',
          icon: 'mat-chevron_left',
          code: true
        }];
        // this.value = this.value || false;
        break;
    }

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].index = i;
      this.items[i].icon = this.setIcon(this.items[i].icon);
    }

    if (this.value) {
      this.selected = this.items.find((i) => { return `${i.code}` === `${this.value}` });
    } else if (this.items.length) {
      this.selected = this.items[0];
      this.value = this.selected.code;
    }
  }

  onToggle() {

    this.selected = this.items[this.selected.index - 1] || this.items[this.items.length - 1];
    this.value = this.selected.code;
    this.changed.emit(this.value);
  }

  onSelect(option) {
    this.selected = option;
    this.value = this.selected.code;
    this.changed.emit(this.value);
  }

  setIcon(icon: any) {
    let wellformed: {
      mat?: string,
      fa?: string,
      oa?: string,
      url?: string
    } = {};
    if (typeof icon === 'string') {
      if (icon.startsWith('http')) {
        wellformed.url = icon;
      } else if (icon.startsWith('fa-')) {
        wellformed.fa = icon.substring(3);
      } else if (icon.startsWith('oa-')) {
        wellformed.oa = icon.substring(3);
      } else if (icon.startsWith('mat-')) {
        wellformed.mat = icon.substring(4);
      } else {
        wellformed.mat = icon;
      }
    } else {
      wellformed = icon;
    }

    return wellformed;
  }

}
