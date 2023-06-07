import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewTaskComponent } from 'src/app/lib/oa-ng/gateway/task-new/task-new.component';
import { Entity } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Organization } from 'src/app/lib/oa/directory/models';
import { Folder } from 'src/app/lib/oa/drive/models';
import { DocsService } from 'src/app/lib/oa/drive/services';
import { Project, Task } from 'src/app/lib/oa/gateway/models';

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrls: ['./new-task-dialog.component.css']
})
export class NewTaskDialogComponent implements OnInit {

  @ViewChild('newTask')
  newTask: NewTaskComponent;

  @Input()
  org: Organization;

  @Input()
  project: Project;

  files: File[] = [];

  entity: Entity;

  constructor(
    private docsService: DocsService,
    private auth: RoleService,
    public dialogRef: MatDialogRef<NewTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (!this.org) {
      this.org = this.auth.currentOrganization();
    }
    if (this.org) {
      this.entity = new Entity({ id: this.org.code, type: 'task' });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onCreated(task: Task) {
    if (this.files && this.files.length && this.auth.currentOrganization()) {
      this.uploadFile(task);
    }
    this.dialogRef.close(task);
  }

  uploadFile(task: Task) {
    const entity = new Entity(task.entity);
    const folder = new Folder({ name: `task-${task.code}`, entity: new Entity(entity) });
    this.files.forEach((file) => {
      this.docsService.createByEntity(entity, file, folder);
    });
  }

  setFiles(files: File[]) {
    this.files = files;
  }

}
