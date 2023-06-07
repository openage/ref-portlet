import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-designation-new',
  templateUrl: './designation-new.component.html',
  styleUrls: ['./designation-new.component.css']
})
export class DesignationNewComponent implements OnInit, OnDestroy {
  page: Link;
  isCurrent = true;

  constructor(
    public dialogRef: MatDialogRef<DesignationNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.navService.register('/master/designations/new', this.route, (isCurrent, params) => {
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
