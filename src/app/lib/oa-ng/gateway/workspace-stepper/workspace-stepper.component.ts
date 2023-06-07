import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from 'src/app/lib/oa/gateway/models';
import { State } from 'src/app/lib/oa/gateway/models/state.model';

@Component({
  selector: 'gateway-workspace-stepper',
  templateUrl: './workspace-stepper.component.html',
  styleUrls: ['./workspace-stepper.component.css']
})
export class WorkspaceStepperComponent implements OnInit {

  @Input()
  task: Task;

  @Input()
  view: string;

  @Output()
  switchStepper: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.setWorkflow();
  }

  setWorkflow() {
    let match: boolean;
    this.task.workflow.states.forEach((state) => {
      if (this.task.currentStatus.code === state.code) {
        state.isSelected = true;
        match = true;
      } else if (!match) {
        state.isComplete = true;
      }
    });
  }
  onSelectStepper(value: string) {
    const data = {
      task: this.task,
      status: value
    };
    this.switchStepper.emit(data);
  }
}
