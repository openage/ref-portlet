import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SprintService } from 'src/app/lib/oa/gateway/services';

@Component({
  selector: 'gateway-close-sprint-dialog',
  templateUrl: './close-sprint-dialog.component.html',
  styleUrls: ['./close-sprint-dialog.component.css']
})
export class CloseSprintDialogComponent implements OnInit {
  selectedItem: any = {};

  @Input()
  items: {
    code: string,
    label: string
  }[]

  defaultItems = [
    {
      code: '',
      label: 'None'
    },
    {
      code: 'backlog',
      label: 'Backlog'
    }
  ]

  constructor(
    public dialog: MatDialogRef<CloseSprintDialogComponent>,
    public sprintService: SprintService,
  ) { }

  ngOnInit(): void {
    this.items = this.items || [];
    this.items = [...this.defaultItems, ...this.items]

  }

  onSelect($event) {
    this.selectedItem = $event.value
  }

  onSubmit() {
    if (!this.selectedItem) return;
    this.dialog.close(this.selectedItem);
  }

}
