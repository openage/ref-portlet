import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Release } from 'src/app/lib/oa/gateway/models/release.model';
import { ReleaseService } from 'src/app/lib/oa/gateway/services/release.service';

@Component({
  selector: 'gateway-release-summary',
  templateUrl: './release-summary.component.html',
  styleUrls: ['./release-summary.component.css']
})
export class ReleaseSummaryComponent implements OnInit, OnChanges {
  @Input()
  release: Release;

  isNew = false;
  isWip = false;
  isValid = true;

  foreColor: string;

  constructor(
    private dialog: MatDialog,
    private releaseService: ReleaseService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.isWip = !(this.release.states.published.isCurrent || this.release.states.rolledBack.isCurrent);
  }

  ngOnChanges() {
  }
  // openDialog() {
  //   const dialogRef = this.uxService.openDialog(NewReleasesDialogComponent, {
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }

  start($event: Date) {
    this.releaseService.update(this.release.id, {
      actual: {
        start: $event
      }
    }).subscribe((release) => {
      this.release = release;
    });
  }

  finish($event: Date) {
    this.releaseService.update(this.release.id, {
      actual: {
        finish: $event
      }
    }).subscribe((release) => {
      this.release = release;
    });
  }

  show() {
    this.router.navigate(['releases', this.release.id]);
  }
}
