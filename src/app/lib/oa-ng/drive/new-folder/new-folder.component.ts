import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { NewFolderBaseComponent } from 'src/app/lib/oa/drive/components/new-folder-base.component';
import { FolderService } from 'src/app/lib/oa/drive/services';

@Component({
  selector: 'drive-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent extends NewFolderBaseComponent {

  url: string;

  constructor(
    service: FolderService,
    uxService: UxService,
    public dialogRef: MatDialogRef<NewFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(service, uxService);
    this.closeDialog = (file) => {
      this.dialogRef.close(file);
    };
  }

  setUrl(event) {
    if (event.target.value.endsWith('png')) {
      this.url = event.target.value;
      this.newFolder.thumbnail = this.url;
    } else {
      this.newFolder.thumbnail = null;
    }
  }

  tripSpace() {
    this.newFolder.name = this.newFolder.name.replace(/^[ ]+|[ ]+$/g, '');
  }

}
