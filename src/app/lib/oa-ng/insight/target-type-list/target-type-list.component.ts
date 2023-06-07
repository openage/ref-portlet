import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { TargetTypeListBaseComponent } from 'src/app/lib/oa/insight/components/target-type-list.base.component';
import { TargetTypeService } from 'src/app/lib/oa/insight/services/target-type.service';

@Component({
  selector: 'insight-target-type-list',
  templateUrl: './target-type-list.component.html',
  styleUrls: ['./target-type-list.component.css']
})
export class TargetTypeListComponent extends TargetTypeListBaseComponent {

  constructor(
    api: TargetTypeService,
    errorHandler: ErrorHandler
  ) {
    super(api, errorHandler);
  }

  ngOnInit() {
  }

}
