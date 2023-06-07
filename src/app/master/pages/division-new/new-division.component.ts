import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { Link } from 'src/app/lib/oa/core/structures';

@Component({
  selector: 'app-new-division',
  templateUrl: './new-division.component.html',
  styleUrls: ['./new-division.component.css']
})
export class NewDivisionComponent implements OnInit {

  page: Link;
  isCurrent = true;
  constructor(
    public dialogRef: MatDialogRef<NewDivisionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private navService: NavService,
    private uxService: UxService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.navService.register('/master/divisions/new', this.route, (isCurrent, params) => {
      this.isCurrent = isCurrent;
      if (this.isCurrent) {
        this.setContext();
      }
    }).then((link) => this.page = link);
  }

  setContext() {
    this.uxService.setContextMenu([{
      helpCode: this.page.meta.helpCode
    }, 'close']);
  }

  created() {
    this.dialogRef.close();
  }
}
