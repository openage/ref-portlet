import { Component } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { ProfileListBaseComponent } from 'src/app/lib/oa/discovery/components/profile-list-base.component';
import { ProfileService } from 'src/app/lib/oa/discovery/services';

@Component({
  selector: 'discovery-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent extends ProfileListBaseComponent {

  constructor(
    api: ProfileService,
    uxService: UxService
  ) {
    super(api, uxService)
  }

}
