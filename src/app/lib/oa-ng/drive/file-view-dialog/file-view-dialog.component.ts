import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Doc } from 'src/app/lib/oa/drive/models';
import { FileEditComponent } from '../file-edit/file-edit.component';

@Component({
  selector: 'drive-file-view-dialog',
  templateUrl: './file-view-dialog.component.html',
  styleUrls: ['./file-view-dialog.component.css']
})
export class FileViewDialogComponent implements OnInit {

  @ViewChild(FileEditComponent)
  fileEditComponent: FileEditComponent;

  file: Doc;

  constructor(
    public dialogRef: MatDialogRef<FileViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.file = new Doc(this.data);
    this.fileEditComponent.setDoc(this.file);
  }



}
