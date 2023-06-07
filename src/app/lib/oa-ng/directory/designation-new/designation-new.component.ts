import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { NewDesignationBaseComponent } from 'src/app/lib/oa/directory/components/new-designation-base.component';
import { DesignationService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-designation-wiz',
  templateUrl: './designation-new.component.html',
  styleUrls: ['./designation-new.component.css']
})
export class DesignationNewComponent extends NewDesignationBaseComponent {

  constructor(
    api: DesignationService,
    uxService: UxService
  ) {
    super(api, uxService);
  }

}
