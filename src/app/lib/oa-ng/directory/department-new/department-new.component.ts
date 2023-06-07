import { Component, OnInit } from '@angular/core';
import { UxService, ValidationService } from 'src/app/core/services';
import { NewDepartmentBaseComponent } from 'src/app/lib/oa/directory/components/new-department-base.component';
import { DepartmentService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-department-wiz',
  templateUrl: './department-new.component.html',
  styleUrls: ['./department-new.component.css']
})
export class DepartmentNewComponent extends NewDepartmentBaseComponent {

  constructor(
    public validationService: ValidationService,
    api: DepartmentService,
    uxService: UxService
  ) {
    super(api, uxService);
  }
}
