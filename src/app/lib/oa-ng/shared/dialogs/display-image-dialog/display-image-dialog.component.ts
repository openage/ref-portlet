import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Doc } from 'src/app/lib/oa/drive/models';

@Component({
  selector: 'app-display-image-dialog',
  templateUrl: './display-image-dialog.component.html',
  styleUrls: ['./display-image-dialog.component.css']
})
export class DisplayImageDialogComponent implements OnInit {

  @Input()
  doc: Doc;

  constructor(
    public dialogRef: MatDialogRef<DisplayImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }
}
