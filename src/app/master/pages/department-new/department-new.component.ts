import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-department-new',
  templateUrl: './department-new.component.html',
  styleUrls: ['./department-new.component.css']
})
export class DepartmentNewComponent implements OnInit, OnDestroy {
  page: Link;
  isCurrent = true;

  constructor(
    public dialogRef: MatDialogRef<DepartmentNewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register('/master/departments/new', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }
  ngOnDestroy(): void {
    this.uxService.reset();
  }

  setContext() {
    this.uxService.setContextMenu([{
      helpCode: this.page.meta.helpCode
    }, 'close']);
  }

  created() {
    this.uxService.showInfo('Created');
    this.dialogRef.close();
    // this.navService.back();
  }

}
