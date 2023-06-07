import { Component, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { ReportAreaListBaseComponent } from 'src/app/lib/oa/insight/components/report-area-list.base.component';
import { ReportAreaService } from 'src/app/lib/oa/insight/services/report-area.service';

@Component({
  selector: 'insight-areas',
  templateUrl: './report-areas.component.html',
  styleUrls: ['./report-areas.component.css']
})
export class ReportAreasComponent extends ReportAreaListBaseComponent {

  constructor(
    public auth: RoleService,
    private api: ReportAreaService,
    private uxService: UxService
  ) {
    super(api, uxService);
  }

}
