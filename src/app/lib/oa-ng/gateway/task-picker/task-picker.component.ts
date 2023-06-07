import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Task } from 'src/app/lib/oa/gateway/models';
import { TaskService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-task-picker',
  templateUrl: './task-picker.component.html',
  styleUrls: ['./task-picker.component.css']
})
export class TaskPickerComponent implements OnInit, OnChanges {

  @Input()
  readonly = false;

  @Input()
  value: Task = new Task();

  @Input()
  searchField = 'text';

  @Input()
  label: string;

  @Input()
  params: any = {};

  @Input()
  options: any = {
    reset: false,
  };

  @Output()
  changed: EventEmitter<Task> = new EventEmitter();

  constructor(
    public taskService: TaskService
  ) { }

  ngOnInit() {
    if (!this.value) { this.value = new Task(); }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.options && this.options.reset) {
      this.value = new Task();
    }
  }

  onSelect($event: any) {
    if (!$event || !$event.code) { return; }
    this.value = $event;
    this.changed.emit(this.value);
  }
}
