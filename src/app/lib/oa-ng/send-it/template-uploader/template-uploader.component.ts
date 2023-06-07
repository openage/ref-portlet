import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { IApi } from 'src/app/lib/oa/core/services';
import { Template } from 'src/app/lib/oa/send-it/models/template.model';
import { TemplateService } from 'src/app/lib/oa/send-it/services';
import { FileUploaderComponent } from 'src/app/lib/oa-ng/shared/components/file-uploader/file-uploader.component';

@Component({
  selector: 'oa-send-it-template-uploader',
  templateUrl: './template-uploader.component.html',
  styleUrls: ['./template-uploader.component.css']
})
export class TemplateUploaderComponent implements OnInit {

  uploader: IApi<Template>;

  @ViewChild('fileUploader')
  fileUploaderComponent: FileUploaderComponent;

  @Input()
  path: string;

  samples: any[] = [];
  options: any = {};

  constructor(
    public dialog: MatDialogRef<TemplateUploaderComponent>,
    private templateService: TemplateService,
    private uxService: UxService
  ) { }

  ngOnInit() {
    this.uploader = this.templateService;
    this.options.path = this.path;
  }

  onCancel() {
    this.dialog.close();
  }

  onUpload() {
    this.fileUploaderComponent.upload().subscribe((message) => {
      message = message || 'Done';
      this.uxService.showInfo(message);
      this.dialog.close();
    }, (err) => {
      this.uxService.handleError(err);
    });
  }
}
