import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { WizStepBaseComponent } from 'src/app/lib/oa/core/structures/wiz/wiz-step-base.component';
import { Employee } from 'src/app/lib/oa/directory/models';
import { EmployeeService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'directory-details-editor',
  templateUrl: './details-editor.component.html',
  styleUrls: ['./details-editor.component.css']
})

export class DetailsEditorComponent extends WizStepBaseComponent implements OnInit {

  @Input()
  readonly: boolean;

  componentRefresh = false;

  // employee = new Employee();
  @Input()
  employee: Employee;

  // accountNo=new CustomFields()
  constructor(
    private api: EmployeeService,
    public uxService: UxService
  ) {
    super();
  }

  ngOnInit() {
    // this.employee.config = new CustomFields();
  }

  validate(): boolean {
    // if (this.usercode !== 'my') {
    //   if (!this.employee.config.accountNo) {
    //     return false;
    //   }
    //   if (!this.employee.config.bank) {
    //     return false;
    //   }
    //   if (!this.employee.config.accountHolder) {
    //     return false;
    //   }
    //   if (!this.employee.config.ifsc) {
    //     return false;
    //   }
    //   if (!this.employee.config.branch) {
    //     return false;
    //   }
    // }

    return true;
  }
  complete(): Observable<any> | boolean {
    if (this.readonly) {
      return this.api.get(this.employee.id);
    }
    if (this.employee.id) {
      return this.api.update(this.employee.id, this.employee);
    } else {
      return this.api.create(this.employee);
    }
  }
}
