import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoleService } from 'src/app/lib/oa/core/services';
import { FileDetailsBaseComponent } from 'src/app/lib/oa/drive/components/file-details-base.component';
import { Doc } from 'src/app/lib/oa/drive/models';
import { DocsService } from 'src/app/lib/oa/drive/services';
import { FileUploaderDialogComponent } from '../file-uploader-dialog/file-uploader-dialog.component';
import { ThumbnailSelectorComponent } from '../thumbnail-selector/thumbnail-selector.component';

@Component({
  selector: 'drive-file-viewer',
  templateUrl: './file-edit.component.html',
  styleUrls: ['./file-edit.component.css']
})

export class FileEditComponent extends FileDetailsBaseComponent {

  @Input()
  fileUploadInputView: string;

  @Input()
  class: string = 'card mat-elevation-z0';

  @Input()
  type: string;

  constructor(
    docsService: DocsService,
    errorHandler: ErrorHandler,
    public dialog: MatDialog,
    public auth: RoleService
  ) {
    super(docsService, errorHandler, auth);
  }

  saveInput(doc: Doc, status?: string) {
    if (status) { doc.status = status; }
    this.api.update(doc.id, doc);
  }

  checkPermissions(check: string) {
    if (this.permissions && this.permissions[check]) {
      return this.auth.hasPermission(this.permissions[check]);
    } else if (('submitted|canceled'.indexOf(this.properties.status) !== -1) && this.properties.owner && this.properties.owner.email) {
      if (this.properties.owner.email === this.auth.currentUser().email) {
        return true;
      }
    } else {
      return false;
    }
  }

  showUploadDialog() {
    const dialogRef = this.dialog.open(FileUploaderDialogComponent);
    dialogRef.componentInstance.doc = this.properties;
    dialogRef.componentInstance.inputView = this.fileUploadInputView;
    dialogRef.componentInstance.permissions = this.permissions;
    dialogRef.afterClosed().subscribe((properties) => {
      if (properties) {
        this.setDoc(properties);
        this.init();
      }
    });
  }

  openThumbnailSelector() {
    const dialogRef = this.dialog.open(ThumbnailSelectorComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.properties.thumbnail = result;
        this.save();
      }
    });
  }

  setDoc(doc: Doc) {
    this.properties = new Doc(doc);
  }

  openInTab() {
    window.open(this.properties.url, '_blank');
  }

  checkContent() {
    if (!this.content) {
      return {};
    } else {
      return this.content;
    }
  }

}
