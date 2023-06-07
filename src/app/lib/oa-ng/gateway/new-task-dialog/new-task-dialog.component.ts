import { Component, ErrorHandler, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { first, forkJoin } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { TaskService } from 'src/app/lib/oa/gateway/services';
import { Task } from 'src/app/lib/oa/gateway/models/task.model'
import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'gateway-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.css']
})
export class NewTaskDialogComponent extends DetailBase<Task> implements OnInit, OnChanges {

  @ViewChild('taskList')
  taskList: TaskListComponent

  @Input()
  heading: string = 'New Task'

  @Input()
  task: Task = new Task({})

  @Input()
  relatedTask: Task

  columns: string[] = ['icon', 'code', 'subject', 'status', 'multi-select']

  constructor(
    public dialog: MatDialogRef<NewTaskDialogComponent>,
    api: TaskService,
    errorHandler: ErrorHandler,
    private auth: RoleService,
    public uxService: UxService,
    public taskService: TaskService
  ) {
    super({ api, errorHandler });
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void { }


  getItems(children, parent) {
    let items = []
    children.forEach((child) => {
      items.push({ id: child.id, parent: parent.id })
    })
    return items
  }

  onCreate() {
    if (!this.relatedTask) {
      this.create(this.task).subscribe((data) => { this.dialog.close() });
      return
    }

    this.taskList.items = this.taskList.items || [];
    const children = this.taskList.items.filter(task => task.isSelected == true).map(t => { return new Task({ id: t.id }) })
    if (!children.length) {
      this.uxService.showInfo('Select subtasks')
      return
    }

    this.create(this.task).subscribe((data) => {
      const items = this.getItems(children, data)

      //update selected children parent and dependsOn
      const observables = [
        this.taskService.bulk(items, 'bulk').pipe(first()),
        this.taskService.updateDependsOn(this.relatedTask, data, false).pipe(first())
      ]

      forkJoin(observables).subscribe({
        next: (result) => {
          if (!result || !result.length) { return }
          this.dialog.close(data)
        },
        error: (err) => { this.uxService.showError(err) },
        complete: () => { }
      })
    });
  }

}
