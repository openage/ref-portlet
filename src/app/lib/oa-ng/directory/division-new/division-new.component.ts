import { Component, OnInit } from '@angular/core';
import { UxService, ValidationService } from 'src/app/core/services';
import { NewDivisionBaseComponent } from 'src/app/lib/oa/directory/components/new-division-base.component';
import { DivisionService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-division-wiz',
  templateUrl: './division-new.component.html',
  styleUrls: ['./division-new.component.css']
})
export class DivisionNewComponent extends NewDivisionBaseComponent {

  constructor(
    api: DivisionService,
    uxService: UxService
  ) {
    super(api, uxService);
  }

}
