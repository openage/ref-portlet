import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { Target } from 'src/app/lib/oa/insight/models';

@Component({
  selector: 'app-target-new-dialog',
  templateUrl: './target-new-dialog.component.html',
  styleUrls: ['./target-new-dialog.component.css']
})
export class TargetNewDialogComponent implements OnInit {

  @Input()
  target: Target;

  @Input()
  title: string;

  @Input()
  placeholder: string;

  @Input()
  label: string;

  @Input()
  required = false;

  constructor(
    private uxService: UxService,
    public dialogRef: MatDialogRef<TargetNewDialogComponent>

  ) {
    this.target = new Target({ target: {} });
  }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.target.type) {
      return this.uxService.handleError('Target Type Required!');
    } else if (!this.target.value) {
      return this.uxService.handleError('Target Required!');
    } else if (!this.target.date) {
      return this.uxService.handleError('Date Required!');
    }
    this.dialogRef.close(this.target);
  }
}
