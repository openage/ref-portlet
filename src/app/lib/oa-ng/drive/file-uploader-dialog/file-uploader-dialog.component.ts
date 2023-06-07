import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UxService } from 'src/app/core/services/ux.service';
import { Entity } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';
import { DocsService } from 'src/app/lib/oa/drive/services';
import { TaskService } from 'src/app/lib/oa/gateway/services';
@Component({
  selector: 'app-file-uploader-dialog',
  templateUrl: './file-uploader-dialog.component.html',
  styleUrls: ['./file-uploader-dialog.component.css']
})

export class FileUploaderDialogComponent implements OnInit {

  @Input()
  options: any = {};

  @Input()
  doc: Doc;

  @Input()
  entity: Entity;

  @Input()
  folder: Folder;

  @Input()
  accept: string[] = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];

  @Input()
  permissions: any;

  @Input()
  visibility: number;

  @Input()
  meta: any = {};

  @Input()
  inputView = 'input';

  file: File;

  minDate: Date = new Date();

  isProcessing: boolean;

  url: string;

  type = 'file';

  fileList: File[] = [];

  count = 0;

  constructor(
    public auth: RoleService,
    private docsService: DocsService,
    private taskService: TaskService,
    private uxService: UxService,
    public dialogRef: MatDialogRef<FileUploaderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (!this.file && this.doc && this.doc.url) {
      this.file = new File([], this.doc.name, { type: this.doc.mimeType });
    }
    if (!this.doc) { this.doc = new Doc(); }
  }

  changeType() {
    this.file = null;
    this.url = null;
  }
  changeDocType(type) {
    this.type = type;
  }

  removeFromFileList(i: number) {
    this.fileList.splice(i, 1);
  }

  setFile(files: any, accept?: string) {
    if (files instanceof Event) { files = (files.target as any).files as File[]; }

    if (!files) { return; }

    const file = files instanceof File ? files : files[0];
    if (!file) { return; }

    this.file = null;
    this.checkAndPush(file, accept);
  }

  checkAndPush(file: File, acceptHTML?: string) {
    if (this.accept && this.accept.length && !acceptHTML) {
      let match = false;
      if (this.accept.find((i) => i === file.type)) {
        match = true;
      }
      if (!match) {
        const regex1 = /image/ig;
        const regex2 = /application/ig;

        let accept = this.accept.join().replace(/\//g, '').replace(regex1, ' ').replace(regex2, ' ').toUpperCase();
        return this.uxService.handleError(`Only filetype${accept} are supported`);
      }
    }

    if (acceptHTML) {
      if (file.type !== acceptHTML) {
        return this.uxService.handleError(`${acceptHTML} Only! ${file.type} are not supported`);
      }
    }

    const fileSize: number = Number((file.size / (1024 * 1024)).toFixed(2));
    if (fileSize > 10) {
      return this.uxService.handleError(`${file.name} cannot be greater than 10 mb`);
    }
    this.file = file;
    this.fileList.push(file);
  }

  updatePlaceholdeFile() {
    this.onCreate(this.file, this.doc);
  }

  onHTMLChange(event: string) {
    this.doc.content = event;
  }

  // close(file) {
  //   this.isProcessing = false
  //   this.dialogRef.close(file);
  // }

  onTabChange(event: MatTabChangeEvent) {
    this.file = null;
    this.url = null;
  }

  onFromChange($event) {
    this.doc.from = $event;
  }

  onTillChange($event) {
    this.doc.till = $event;

  }

  isValid() {
    if (this.doc && this.doc.isPlaceholder && this.doc) {
      if (!this.file && (this.type === 'file')) { return false; }
    }
    return true;
  }

  createByType() {
    if (this.type === 'file' && this.fileList.length) {
      if (this.fileList.length) {
        this.onCreate(this.file, this.doc);
      } else {
        this.isProcessing = false;
        this.uxService.handleError('Upload file to create');
      }
    } else {
      if (this.doc.name) {
        if ((this.type === 'link') && !this.url) {
          this.isProcessing = false;
          this.uxService.handleError('Fill the Url and Name');
          return;
        }

        this.doc.mimeType = this.type;
        this.doc.url = this.url;
        if (this.folder) {
          const folder = this.folder;
          folder.files = [];
          folder.folders = [];
          this.doc.folder = folder;
        }
        if (this.entity) { this.doc.entity = this.entity; }
        if (this.visibility !== undefined) { this.doc.visibility = this.visibility; }
        this.docsService.create(this.doc).subscribe((item) => {
          this.isProcessing = false;
          this.dialogRef.close(item);
        }, (err) => {
          this.isProcessing = false;
          this.uxService.handleError(err);
        });
      } else {
        this.isProcessing = false;
        this.uxService.handleError('Please Fill Details');
      }
    }
  }

  onCreate(file: File, doc?: Doc) {
    if (file && !doc) { doc = new Doc({}); }
    this.isProcessing = true;
    this.docsService.simpleCreate(this.file, {
      id: doc.id,
      name: doc.name,
      folder: doc.folder || this.folder,
      code: doc.code,
      status: this.permissions && !this.auth.hasPermission(this.permissions.activate) ? 'submitted' : 'active',
      identifier: doc.identifier,
      till: doc.till,
      from: doc.from,
      entity: this.entity || doc.entity,
      meta: doc.meta,
      visibility: doc.visibility || this.visibility || 1,
      tags: doc.tags || [],
      creator: this.auth.currentRole().email
    }).subscribe((item) => {
      this.isProcessing = false;
      if (item.meta && item.meta.task) {
        const taskId = item.meta.task;
        this.taskService.update(taskId, { status: item.status, meta: { doc: item } });
      }
      this.dialogRef.close(item);
    }, (err) => {
      this.isProcessing = false;
    });
  }

}
