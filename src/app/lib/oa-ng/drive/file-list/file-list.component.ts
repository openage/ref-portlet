import { Component, ErrorHandler, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from 'src/app/lib/oa/core/services';
import { DocsService } from 'src/app/lib/oa/drive/services';
import { Doc } from 'src/app/lib/oa/drive/models';
import { DisplayImageDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/display-image-dialog/display-image-dialog.component';
import { UxService } from 'src/app/core/services/ux.service';
import { ValidationService } from 'src/app/core/services';
import { FileListBaseComponent } from 'src/app/lib/oa/drive/components/file-list-base.component';
import { FileUploaderDialogComponent } from '../file-uploader-dialog/file-uploader-dialog.component';

@Component({
  selector: 'drive-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent extends FileListBaseComponent {

  @Input()
  fileUploadInputView: string;

  @Output()
  refresh: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    auth: RoleService,
    fileService: DocsService,
    private uxService: UxService,
    validator: ValidationService

  ) {
    super(auth, fileService, uxService, validator);
  }

  getFileSize(file) {
    if (!file.size) {
      return '--';
    }
    const fileSize: number = Number((file.size / (1024 * 1024)).toFixed(2));
    return `${fileSize} MB`;
  }

  onRefresh() {
    this.refresh.emit();
  }

  openDialog(): void {
    const dialogRef = this.uxService.openDialog(FileUploaderDialogComponent);
    const instance = dialogRef.componentInstance;
    instance.entity = this.entity;
    instance.folder = this.folder;
    instance.visibility = this.visibility || this.folder ? this.folder.visibility : undefined;
    instance.inputView = this.fileUploadInputView || 'layout';
    dialogRef.afterClosed().subscribe((doc) => {
      if (doc) { setTimeout(() => { this.init(); }, 1000); this.onRefresh() }
    });
  }

  showImgInDialog(doc: Doc): void {
    if (this.readonly) {
      return;
    } else {
      const dialogRef = this.uxService.openDialog(DisplayImageDialogComponent, {
        panelClass: 'showImageDialog',
        width: 'auto',
        height: 'auto'
      });

      const instance = dialogRef.componentInstance;
      instance.doc = doc;
    }
  }

}
