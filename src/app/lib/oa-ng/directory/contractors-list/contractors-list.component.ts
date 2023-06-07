import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService, ValidationService } from 'src/app/core/services';
import { ContractorsListBaseComponent } from 'src/app/lib/oa/directory/components/contractors-list-base.component';
import { Contractor } from 'src/app/lib/oa/directory/models';
import { ContractorService } from 'src/app/lib/oa/directory/services/contractor.service';

@Component({
  selector: 'directory-contractors-list',
  templateUrl: './contractors-list.component.html',
  styleUrls: ['./contractors-list.component.css']
})
export class ContractorsListComponent extends ContractorsListBaseComponent implements OnInit {
  update: any;
  @Input()
  view: 'table' | 'list' | 'grid' = 'table';
  dialogRef: any;

  constructor(public dialog: MatDialog,
    public validationService: ValidationService,
    api: ContractorService,
    public uxService: UxService
  ) {
    super(api, uxService);
  }

  edit(item: Contractor, isEdit: boolean) {
    if (isEdit) {
      item.isEdit = true;
    } else {
      this.fetch();
      item.isEdit = false;
    }
  }

  save(item) {
    item.isEdit = false;
    this.update(item);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  openDialog(item): void {
    this.uxService.onConfirm().subscribe(() => {
      this.remove(item);
      this.uxService.showInfo('Deleted');
    });
  }
}
