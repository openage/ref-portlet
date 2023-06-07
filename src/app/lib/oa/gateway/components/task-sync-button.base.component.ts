import { ErrorHandler, Input, OnChanges, OnInit, Directive } from '@angular/core';

import { Project } from '../models';
import { TaskService } from '../services';

@Directive()
export class TaskSyncButtonBaseComponent implements OnInit, OnChanges {

  @Input()
  project: Project;

  isProcessing = false;

  constructor(
    private service: TaskService,
    private errorHandler: ErrorHandler
  ) {

  }
  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }

  sync() {
    this.isProcessing = true;
    // this.service.sync(this.project).subscribe(() => {
    //   this.isProcessing = false;
    // }, (err) => {
    //   this.isProcessing = false;
    //   this.errorHandler.handleError(err);
    // });
  }
}
