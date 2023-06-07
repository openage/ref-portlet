import { Component } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { ReleaseListBaseComponent } from 'src/app/lib/oa/gateway/components/release-list.base.component';
import { ReleaseService } from 'src/app/lib/oa/gateway/services';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'gateway-release-ongoing-list',
  templateUrl: './release-ongoing-list.component.html',
  styleUrls: ['./release-ongoing-list.component.css']
})
export class ReleaseOngoingListComponent extends ReleaseListBaseComponent {

  constructor(
    releaseService: ReleaseService,
    uxService: UxService
  ) {
    super(releaseService, uxService);
  }
}
