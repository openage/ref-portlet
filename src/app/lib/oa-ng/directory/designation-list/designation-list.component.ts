import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService, ValidationService } from 'src/app/core/services';
import { DesignationListBaseComponent } from 'src/app/lib/oa/directory/components/designation-list-base.component';
import { Division } from 'src/app/lib/oa/directory/models';
import { DesignationService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-designation-list',
  templateUrl: './designation-list.component.html',
  styleUrls: ['./designation-list.component.css']
})
export class DesignationListComponent extends DesignationListBaseComponent {
  @Input()
  view: 'table' | 'list' | 'grid' = 'table';
  dialogRef: any;
  constructor(public dialog: MatDialog,

    public validationService: ValidationService,
    public api: DesignationService,
    public uxService: UxService
  ) {
    super(api, uxService);
  }

  onSelect(item: any) {
    item.isSelected = true;
  }

  save(item) {
    item.isSelected = false;
    this.update(item);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openDialog(item): void {
    this.uxService.onConfirm({
      message: 'Are you sure you want to delete?'
    }).subscribe(() => {
      this.remove(item);
      this.uxService.showInfo('Deleted');
    });
  }
}
