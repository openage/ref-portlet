import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { GenericApi, RoleService } from 'src/app/lib/oa/core/services';
import { IUploader } from 'src/app/lib/oa/core/services/uploader.interface';
import { FileUploaderComponent } from '../../components/file-uploader/file-uploader.component';

@Component({
  selector: 'oa-importer',
  templateUrl: './importer.component.html',
  styleUrls: ['./importer.component.css']
})
export class ImporterComponent implements OnInit {

  title = 'Upload';
  uploader: IUploader;
  options: any;
  isProcessing: boolean = false
  task: any = {};
  timeOut: any;
  disabled: boolean = false

  @Input()
  selectedMapper: any;

  @ViewChild('fileUploader')
  fileUploaderComponent: FileUploaderComponent;

  samples: {
    name: string,
    mapper: string,
    url: string;
  }[] = [];
  errorMessage: string;

  constructor(
    public dialog: MatDialogRef<ImporterComponent>,
    private uxService: UxService,
    public httpClient: HttpClient,
    public auth: RoleService
  ) { }

  ngOnInit() {
  }

  onCancel() {
    this.dialog.close(false);
  }

  onMinimize() {
    if (!this.isProcessing) {
      this.dialog.close(false);
      return
    }
    if (!this.task || !this.task.id) {
      this.uxService.showInfo('Wait');
      return
    }

    const item = {
      id: this.task.id,
      name: this.fileUploaderComponent.file.name,
      icon: this.uxService.getIcon(this.fileUploaderComponent.file.type),
      status: this.task.status,
      progress: this.task.progress || 0,
      api: {
        code: this.uploader['code'],
        service: 'tasks'
      }
    }

    this.uxService.handleItemProgress(item)
    clearInterval(this.timeOut)
    this.dialog.close(false);
  }

  onUpload() {
    this.errorMessage = ''
    if (!this.fileUploaderComponent.file || !this.fileUploaderComponent.file.name) {
      this.errorMessage = 'Select any file to upload'
      return
    }

    this.isProcessing = true;
    this.disabled = true;
    this.fileUploaderComponent.upload().subscribe((message: any) => {
      if (typeof message === 'object' && message.taskId) {
        this.setTask(message)
        return
      }
      message = message || 'Done';
      this.uxService.showInfo(message);
      this.dialog.close(true);
      this.isProcessing = false;
    }, (err) => {
      this.uxService.handleError(err);
      this.disabled = false;
      this.isProcessing = false;
    });
  }

  onChange($event: any) {
    this.options.queryParams = this.options.queryParams || {};
    this.options.queryParams.format = $event.value;
  }

  setTask(data) {
    this.task.id = data.taskId || data.id
    this.task.status = data.status

    if (this.task.status === 'in-progress' || this.task.status === 'queued') {
      this.getTask()
      return
    }
    this.close()
  }

  getTask() {
    const connectApi = new GenericApi(this.httpClient, 'connect', {
      collection: 'tasks',
      auth: this.auth,
      errorHandler: this.uxService,
    });

    this.timeOut = setInterval(() => {
      if (this.task.status === 'in-progress' || this.task.status === 'queued') {
        connectApi.get(this.task.id).subscribe(data => {
          this.task = data
        })
      } else {
        this.close()
      }
    }, 3000)
  }

  close() {
    this.uxService.showInfo('Done');
    this.dialog.close(true);
    this.isProcessing = false;
    clearInterval(this.timeOut)
  }
}
