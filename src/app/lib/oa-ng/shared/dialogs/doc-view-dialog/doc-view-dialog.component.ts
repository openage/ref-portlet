import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-doc-view-dialog',
  templateUrl: './doc-view-dialog.component.html',
  styleUrls: ['./doc-view-dialog.component.css']
})
export class DocViewDialogComponent implements OnInit {
  @Input()
  rfqTemplate: any;

  value: any;

  constructor(
    public dialogRef: MatDialogRef<DocViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    this.value = this.rfqTemplate.body;
  }

  close(): void {
    this.dialogRef.close();
  }

}
