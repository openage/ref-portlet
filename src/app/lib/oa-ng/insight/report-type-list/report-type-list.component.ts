import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { ReportTypeListBaseComponent } from 'src/app/lib/oa/insight/components/report-type-list.base.component';
import { RoleService } from 'src/app/lib/oa/core/services';
import { ReportTypeService } from 'src/app/lib/oa/insight/services/report-type.service';

@Component({
  selector: 'insight-report-type-list',
  templateUrl: './report-type-list.component.html',
  styleUrls: ['./report-type-list.component.css']
})
export class ReportTypeListComponent extends ReportTypeListBaseComponent {

  constructor(
    public auth: RoleService,
    private api: ReportTypeService,
    private uxService: UxService
  ) {
    super(api, uxService);
  }

}
