import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Entity } from 'src/app/lib/oa/core/models';

@Component({
  selector: 'app-entity-new-dialog',
  templateUrl: './entity-new-dialog.component.html',
  styleUrls: ['./entity-new-dialog.component.css']
})
export class EntityNewDialogComponent implements OnInit {

  title = 'New Entity';
  entity: Entity;

  constructor(
    public dialogRef: MatDialogRef<EntityNewDialogComponent>
  ) {
  }

  ngOnInit() {
    this.entity = new Entity();
  }

  onContinue() {
    this.dialogRef.close(this.entity);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
