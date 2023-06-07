import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FieldEditorModel } from 'src/app/lib/oa/core/models';
import { ReportParam } from 'src/app/lib/oa/insight/models';

@Component({
  selector: 'oa-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.css']
})
export class FiltersDialogComponent implements OnInit {

  @Input()
  selectedFilters: FieldEditorModel[] = [];

  @Input()
  availableFilters: FieldEditorModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<FiltersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onSelect(event: MatCheckboxChange, param: FieldEditorModel) {
    if (event.checked) {
      if (!this.selectedFilters.some(p => p.key === param.key)) {
        this.selectedFilters.push(param);
      }
      const index = this.availableFilters.indexOf(param);
      this.availableFilters.splice(index, 1);
    } else {
      const index = this.selectedFilters.indexOf(param);
      this.selectedFilters.splice(index, 1);
    }
  }

  removeFilter(event: FieldEditorModel) {
    const index = this.selectedFilters.indexOf(event);
    this.selectedFilters.splice(index, 1);
    this.availableFilters.push(event);
  }

  onSubmit() {
    this.dialogRef.close({
      availableFilters: this.availableFilters,
      selectedFilters: this.selectedFilters
    })
  }
}
