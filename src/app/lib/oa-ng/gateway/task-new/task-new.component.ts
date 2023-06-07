import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { TaskNewBaseComponent } from 'src/app/lib/oa/gateway/components/task-new.base.component';
import { ProjectService, TaskService } from 'src/app/lib/oa/gateway/services';
import { InputTextComponent } from 'src/app/lib/oa-ng/shared/components/input-text/input-text.component';

@Component({
  selector: 'gateway-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.scss']
})

export class NewTaskComponent extends TaskNewBaseComponent {

  @Input()
  view: 'list-item' | 'row' | 'expanded' |'attributes' | 'field' | 'markdown' = 'row';

  @Output()
  addSelectedFiles: EventEmitter<File[]> = new EventEmitter();

  @ViewChild('inputText')
  inputText: InputTextComponent;

  today: Date = new Date();

  fileList: File[] = [];
  points: any[] = [];
  priorities: any[] = [];

  constructor(
    api: TaskService,
    projectService: ProjectService,
    public uxService: UxService,
    auth: RoleService
  ) {
    super(api, uxService, auth);
    this.points = api.points;
    this.priorities = api.priorities;
  }

  createClicked() {
    const text = (this.inputText.nativeElement as any).value;
    this.onCreate(text);
  }

  removeFile(index) {
    this.fileList.splice(index, 1);
    this.addSelectedFiles.emit(this.fileList);
  }

  addFiles(file: File) {
    const fileSize: number = Number((file.size / (1024 * 1024)).toFixed(2));

    if (fileSize > 10) {
      return this.uxService.handleError(`File size is greater than 10 mb`);
    }

    if (!this.fileList.find((item) => item.name === file.name && item.type === file.type)) {
      this.fileList.push(file);
    }
    this.addSelectedFiles.emit(this.fileList);
  }

  onMetaUpdate($event) {
  }

  convertToJson($event) { 
  }

}
