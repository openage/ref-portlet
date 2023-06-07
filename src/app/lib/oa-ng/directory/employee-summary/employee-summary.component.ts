import { Component, ErrorHandler, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavService, UxService } from 'src/app/core/services';
import { IBreadcrumbHandler } from 'src/app/lib/oa/core/services/breadcrumb-handler.interface';
import { IContextMenuHandler } from 'src/app/lib/oa/core/services/context-menu-handler.interface';
import { IEntityHandler } from 'src/app/lib/oa/core/services/entity-handler.interface';
import { ITitleHandler } from 'src/app/lib/oa/core/services/title-handler.interface';
import { DetailBase } from 'src/app/lib/oa/core/structures';
import { Employee } from 'src/app/lib/oa/directory/models';
import { EmployeeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-employee-summary',
  templateUrl: './employee-summary.component.html',
  styleUrls: ['./employee-summary.component.css']
})
export class EmployeeSummaryComponent extends DetailBase<Employee> implements OnInit, OnChanges {

  @Input()
  code: string;

  constructor(
    api: EmployeeService,
    private uxService: UxService

  ) {
    super({ api, errorHandler: uxService });
  }
  ngOnChanges(): void {
    this.get(this.code);

  }
  ngOnInit(): void {
  }

}
