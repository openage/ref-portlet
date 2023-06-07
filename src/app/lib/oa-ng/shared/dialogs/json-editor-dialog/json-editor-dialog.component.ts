import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-json-editor-dialog',
  templateUrl: './json-editor-dialog.component.html',
  styleUrls: ['./json-editor-dialog.component.css']
})
export class JsonEditorDialogComponent implements OnInit {

  @Input()
  config: any = {};

  @Input()
  label = 'Config';

  value: any;

  constructor(
    public dialog: MatDialogRef<JsonEditorDialogComponent>
  ) { }

  ngOnInit() {
    this.value = this.config;
  }

  setContent($event) {
    this.value = $event;
  }

  save() {
    this.config = this.value;
    this.dialog.close(this.config);
  }

  cancel() {
    this.dialog.close();
  }
}
