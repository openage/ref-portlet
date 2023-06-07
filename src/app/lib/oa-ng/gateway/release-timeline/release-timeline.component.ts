import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UxService } from 'src/app/core/services/ux.service';
import { ReleaseListBaseComponent } from 'src/app/lib/oa/gateway/components/release-list.base.component';
import { Release } from 'src/app/lib/oa/gateway/models';
import { ReleaseService } from 'src/app/lib/oa/gateway/services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'gateway-release-timeline',
  templateUrl: './release-timeline.component.html',
  styleUrls: ['./release-timeline.component.css']
})
export class ReleaseTimelineComponent extends ReleaseListBaseComponent {
  constructor(
    releaseService: ReleaseService,
    uxService: UxService,
    private router: Router
  ) {
    super(releaseService, uxService);
    this.isClosed = true;
  }

  show(release: Release) {
    this.router.navigate(['releases', release.id]);
  }
}
