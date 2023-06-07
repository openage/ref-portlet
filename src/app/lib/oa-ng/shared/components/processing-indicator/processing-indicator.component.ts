import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TaskService } from 'src/app/lib/oa/directory/services/task.service';

@Component({
  selector: 'processing-indicator',
  templateUrl: './processing-indicator.component.html',
  styleUrls: ['./processing-indicator.component.scss']
})
export class ProcessingIndicatorComponent implements OnInit, OnChanges {

  @Input()
  inline = false;

  @Input()
  view: 'bars' | 'spinner' | 'progress-bar' | 'spinball' | 'stepper' | 'download-indicator' | 'spinner-withBackground' = 'bars';

  @Input()
  progressBarMode: 'determinate' | 'indeterminate' | 'buffer' | 'query' = 'buffer';

  @Input()
  progressBarBufferValue = 0;

  @Input()
  progressBarvalue = 0;

  @Input()
  progressTaskId: string;

  @Input()
  progressError: string;

  @Input()
  diameter: number = 100

  @Input()
  steps: {
    label: string,
    status: string,   // default, active, completed
    rightBar?: boolean,
    style: string
  }[]

  @Input()
  currentStep: number | string;

  @Output()
  done: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  type: string;

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.type = `${this.inline ? 'inline' : 'cover'}-${this.view}`;
    if (this.type === 'stepper') {
      this.steps.forEach((step, i) => {
        if (i === 0) { step.rightBar = false; }
      })
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.type = `${this.inline ? 'inline' : 'cover'}-${this.view}`;
    if (this.progressTaskId) {
      this.checkProgress();
    }
    if (this.currentStep && changes.hasOwnProperty('currentStep')) {
      this.next();
    }
  }

  checkProgress() {
    const new_this = this;
    this.taskService.get(this.progressTaskId).subscribe((task) => {
      if (task.status === 'complete') {
        this.progressBarvalue = task.progress;
        this.done.emit(true);
      } else if (task.status === 'errored') {
        this.progressBarvalue = task.progress;
        this.progressError = task.error;
      } else {
        this.progressBarvalue = task.progress;
        setTimeout(() => { new_this.checkProgress(); }, 1000);
      }
    }, (err) => {
      this.error.emit(true);
    });
  }

  next() {
    if (this.currentStep === 'completed') {
      this.steps.forEach(step => {
        step.status = 'completed';
        step.rightBar = true;
      })
      return
    }

    let currentIndex = this.steps.findIndex((step) => step.label === this.currentStep);
    if (this.steps[currentIndex]) {
      this.steps[currentIndex].status = 'active';
    }

    this.steps.forEach((step, i) => {
      if (i < currentIndex) {
        step.status = 'completed';
        step.rightBar = true;
      }
    })

  }
}
