import { Component, ErrorHandler, OnInit } from '@angular/core';
import { TargetDetailBaseComponent } from 'src/app/lib/oa/insight/components/target-detail.base.component';
import { TargetService } from 'src/app/lib/oa/insight/services/target.service';

@Component({
  selector: 'insight-target-detail',
  templateUrl: './target-detail.component.html',
  styleUrls: ['./target-detail.component.css']
})
export class TargetDetailComponent extends TargetDetailBaseComponent {

  constructor(
    api: TargetService,
    auth: ErrorHandler) {
    super(api, auth);
  }

  addMember() {
    // this.properties.team.push({
    //   value: 0,
    //   status: 'new',
    //   user: null
    // });
  }

  getMyTarget(target) {
    return (target.value - target.team.reduce((accumulator, currentValue) => accumulator + currentValue['value'], 0));
  }

  removeMember(index) {
    //  this.properties.target.team.splice(index, 1);
  }

}
