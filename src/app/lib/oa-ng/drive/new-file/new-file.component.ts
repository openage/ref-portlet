import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UxService } from 'src/app/core/services';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';
import { DocsService } from 'src/app/lib/oa/drive/services';
import { ThumbnailSelectorComponent } from '../thumbnail-selector/thumbnail-selector.component';

@Component({
  selector: 'app-new-file',
  templateUrl: './new-file.component.html',
  styleUrls: ['./new-file.component.css']
})
export class NewFileComponent implements OnInit {

  static instancesCount = 0;

  @Input()
  parentFolder: Folder;

  inputId: string;

  file: File;

  doc: Doc;

  name: string;

  type = 'file';

  url: string;

  constructor(
    private uxService: UxService,
    private docService: DocsService,
    private router: Router,
    public dialogRef: MatDialogRef<ThumbnailSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.inputId = `file-uploader-input-${NewFileComponent.instancesCount++}`;
  }

  ngOnInit() {
    this.doc = new Doc({ folder: this.parentFolder });
  }

  setfiles(files: any) {
    for (const file of files) {
      this.file = file;
    }
  }

  changeType() {
    this.file = null;
    this.url = null;
  }

  close(file) {
    this.dialogRef.close(file);
  }

  create(file) {
    switch (this.type) {
      case 'file':

        if (!this.file) {
          return this.uxService.handleError('No file selected');
        }

        this.docService.simpleCreate(file, {
          name: this.name,
          folder: this.parentFolder
        }).subscribe((item) => { this.close(item); });

        break;

      case 'link':
        if (!this.url) {
          return this.uxService.handleError('Url is required');
        }

        if (!this.name) {
          return this.uxService.handleError('Name is required');
        }
        this.doc.mimeType = 'link';
        this.doc.url = this.url;
        this.doc.name = this.name;
        this.createNormal(this.doc);

        break;
      case 'html':
      case 'json':
        if (!this.name) {
          return this.uxService.handleError('Name is required');
        }
        this.doc.mimeType = this.type;
        this.doc.name = this.name;
        this.createNormal(this.doc);

        break;
    }

  }

  createNormal(doc) {
    this.docService.create(doc).subscribe((item) => { this.close(item); });
  }

}
