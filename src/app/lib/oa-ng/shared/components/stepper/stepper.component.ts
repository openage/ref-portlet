import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'shared-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {

  @Input()
  items: {
    title: string,
    value: string,
    active: boolean,
    style: string
  }[]

  @Output()
  selected: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSelect(item) {
    item.active = true;
    this.selected.emit(item);
  }

}
