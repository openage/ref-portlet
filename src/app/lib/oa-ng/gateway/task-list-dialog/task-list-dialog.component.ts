import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from 'src/app/lib/oa/gateway/models';

@Component({
  selector: 'gateway-task-list-dialog',
  templateUrl: './task-list-dialog.component.html',
  styleUrls: ['./task-list-dialog.component.css']
})
export class TaskListDialogComponent implements OnInit {

  @Input()
  config: any = {};

  @Input()
  parent: Task;
  disabled = true;

  columns: string[] = ['index', 'subject', 'assignee', 'start', 'end', 'status', 'checkbox'];
  constructor(
    public dialogRef: MatDialogRef<TaskListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.config = this.config || {};
    this.config.hide = this.config.hide || {};
    this.config.cancel = this.config.cancel || {
      title: 'Cancel'
    };

    this.config.save = this.config.save || {
      title: 'Ok'
    };
    this.config.title = this.config.title || 'Action Items';
  }

  onSave() {
    this.dialogRef.close(this.parent);
  }

  onChecked(items) {
    if (items.find((i) => !i.isSelected || i.isSelected === false)) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }

}
