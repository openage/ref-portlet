import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { Release } from 'src/app/lib/oa/gateway/models/release.model';

@Component({
  selector: 'gateway-new-release-dialog',
  templateUrl: './new-release-dialog.component.html',
  styleUrls: ['./new-release-dialog.component.css']
})
export class NewReleaseDialogComponent implements OnInit {

  release: Release;

  constructor(
    public dialog: MatDialogRef<NewReleaseDialogComponent>,
    private uxService: UxService
  ) { }

  ngOnInit() {
    this.release = new Release();
  }

  proceed() {

    if (!this.release.type) {
      return this.uxService.handleError('Type is required');
    }

    if (this.release.type === 'custom') {
      if (this.release.code) {
        return this.uxService.handleError('Version is required');
      } else {
        this.release.code = undefined;
      }
    }

    this.dialog.close(this.release);
  }

  cancel() {
    this.dialog.close();
  }

}
