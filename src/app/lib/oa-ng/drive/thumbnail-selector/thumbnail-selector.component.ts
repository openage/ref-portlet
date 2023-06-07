import { Component, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { Entity } from 'src/app/lib/oa/core/models';
import { Doc, Folder } from 'src/app/lib/oa/drive/models';
import { FileProviderComponent } from 'src/app/lib/oa-ng/shared/components/file-provider/file-provider.component';

@Component({
  selector: 'app-thumbnail-selector',
  templateUrl: './thumbnail-selector.component.html',
  styleUrls: ['./thumbnail-selector.component.css']
})
export class ThumbnailSelectorComponent implements OnInit {

  @ViewChild('fileProvider')
  fileProvider: FileProviderComponent;

  @Input()
  cropRatio: number;

  @Input()
  okLabel = 'Update';

  @Input()
  dialogTitle = 'Thumbnail Image';

  @Input()
  size = 10; // 10mb

  file: File;

  view = 'upload';

  url: string;

  entity: Entity;

  extensions: string[] = ['png', 'jpg', 'jpeg'];

  constructor(
    private uxService: UxService,
    public dialogRef: MatDialogRef<ThumbnailSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() { }

  onSave(item: string | Doc) {
    if (!item) {
      return;
    }
    if (typeof item === 'string') {
      this.dialogRef.close(item);
    } else {
      this.dialogRef.close(item.url);
    }
  }

  setFile(files: File | File[] | Event) {

    if (files instanceof Event) {
      files = (files.target as any).files as File[];
    }

    if (!files) { return; }
    const file = files instanceof File ? files : files[0];
    if (!file) { return; }

    this.file = null;

    const fileSize: number = Number((file.size / (1024 * 1024)).toFixed(2));
    if (fileSize > this.size) {
      return this.uxService.handleError(`File cannot be greater than ${this.size} mb`);
    }
    this.file = file;
  }

  setUrl($event) {
    const url = this.uxService.getTextFromEvent($event);

    if (!url) {
      return;
    }

    if (!this.extensions.find((e) => url.endsWith(e))) {
      return this.uxService.handleError(`Url must ends with ${this.extensions.join(',')}`);
    }
    this.url = url;
  }

}
