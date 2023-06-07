import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UxService } from 'src/app/core/services/ux.service';
import { Project, Release } from 'src/app/lib/oa/gateway/models';
import { ReleaseService } from 'src/app/lib/oa/gateway/services';
import { NewReleaseDialogComponent } from '../new-release-dialog/new-release-dialog.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'gateway-release-button',
  templateUrl: './release-button.component.html',
  styleUrls: ['./release-button.component.css']
})
export class ReleaseButtonComponent implements OnInit {

  @Input()
  project: Project;

  @Output()
  created: EventEmitter<Release> = new EventEmitter();

  isProcessing = false;

  constructor(
    private releaseService: ReleaseService,
    private uxService: UxService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  newRelease() {
    const dialogRef = this.uxService.openDialog(NewReleaseDialogComponent);

    dialogRef.afterClosed().subscribe((newRelease: Release) => {
      if (!newRelease) {
        return;
      }

      newRelease.project = this.project;
      this.isProcessing = true;
      this.releaseService.create(newRelease).subscribe((release) => {
        this.isProcessing = false;
        this.created.emit(release);
        this.router.navigate(['/releases', release.id]);
      }, (err) => {
        this.isProcessing = false;
        this.uxService.handleError(err);
      });
    });
  }

}
