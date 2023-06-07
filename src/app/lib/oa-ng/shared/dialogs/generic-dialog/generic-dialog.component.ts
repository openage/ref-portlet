import { Component, HostListener, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Action } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'oa-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.css']
})
export class GenericDialogComponent implements OnInit {

  @Input()
  errors: Error | Error[] | string | string[];

  @Input()
  title: string;

  @Input()
  bodyTemplate: TemplateRef<any>;

  @Input()
  actions: Action[];

  constructor(
    public dialogRef: MatDialogRef<GenericDialogComponent>,

  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  @HostListener('keydown.esc')
  public onEsc() {
    this.dialogRef.close();
  }

  @HostListener('keydown.enter')
  public onEnter() {
    this.dialogRef.close(true);
  }

}
