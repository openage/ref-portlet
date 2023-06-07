import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { FileDetailsBaseComponent } from 'src/app/lib/oa/drive/components/file-details-base.component';
import { Doc } from 'src/app/lib/oa/drive/models';
import { DocsService } from 'src/app/lib/oa/drive/services';
import { RejectMsgDialogComponent } from 'src/app/lib/oa-ng/shared/dialogs/reject-msg-dialog/reject-msg-dialog.component';
import { FileUploaderDialogComponent } from '../file-uploader-dialog/file-uploader-dialog.component';

@Component({
  selector: 'drive-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.css']
})
export class FileDetailComponent extends FileDetailsBaseComponent {

  @Input()
  index: number;

  @Input()
  readonly = false;

  @Input()
  fileUploadInputView: string;

  @Input()
  placeholder: string | {
    code: string
  } = 'Choose File';

  @Input()
  permissions: {
    create?: string[],
    activate?: string[],
    update?: string[],
    remove?: string[]
  } = {};

  @Output()
  afterUpdate: EventEmitter<any> = new EventEmitter<any>();

  isProcessing: boolean;

  pending: File;

  readyForDrop = false;
  fileDropped = false;

  constructor(
    public dialog: MatDialog,
    public service: DocsService,
    private uxService: UxService,
    public auth: RoleService
  ) {
    super(service, uxService, auth);
  }

  show(): void {
    if (this.content) {
      this.onOpen();
    } else if (!this.properties.isPlaceholder) {
      this.onOpen();
    } else if (this.properties.status !== 'not-applicable') {
      this.showUploadDialog();
    }
  }

  showUploadDialog() {
    const dialogRef = this.dialog.open(FileUploaderDialogComponent, { width: '550px' });
    dialogRef.componentInstance.doc = this.properties;
    dialogRef.componentInstance.inputView = this.fileUploadInputView;
    dialogRef.componentInstance.permissions = this.permissions;
    dialogRef.afterClosed().subscribe((properties) => {
      if (properties) {
        this.properties = properties;
        this.init();
        this.afterUpdate.emit(this.properties);
      }
    });
  }

  notApplicable() {
    const dialogRef = this.dialog.open(RejectMsgDialogComponent, {
      width: '400px',
    });

    dialogRef.componentInstance.config = { message: { title: 'Remarks' } };

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const model: any = {};
        model.meta = {};
        model.status = 'not-applicable';
        this.properties.status = 'not-applicable';
        model.meta['not-applicable'] = result;
        this.service.update(this.properties.id, model).subscribe(result => {
          this.afterUpdate.emit();
        });

      }
    });
  }

  missingFile(status) {
    if (!this.properties) {
      return true;
    }
    if (!status.includes(this.properties.status)) {
      return true;
    }
    return false;
  }

  upload(file: File) {
    if (this.properties.meta.required) {
      const dialogRef = this.uxService.openDialog(FileUploaderDialogComponent);
      dialogRef.componentInstance.file = file;
      dialogRef.componentInstance.permissions = this.permissions;
      dialogRef.componentInstance.doc = this.properties;
      return dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.properties = new Doc(result);
        }
      });
    }
  }

  onFileSelected(event) {
    if (event.target.files.length > 1) {
      return this.errorHandler.handleError(`Please select 1 file only`);
    }
    this.upload(event.target.files[0]);
  }

  onFileDrop(fileList: FileList) {
    const newFile = fileList.item(0);
    this.upload(newFile);
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

  @HostListener('dragover', ['$event'])
  onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const items = evt.dataTransfer.items;
    if (items.length > 0) {
      this.readyForDrop = true;
    }
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.readyForDrop = false;
  }

  @HostListener('drop', ['$event'])
  public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    this.readyForDrop = false;
    if (files.length > 0) {
      if (files.length > 1) {
        return this.errorHandler.handleError(`Please select 1 file only`);
      }
      this.upload(files[0]);
    }
  }

}
