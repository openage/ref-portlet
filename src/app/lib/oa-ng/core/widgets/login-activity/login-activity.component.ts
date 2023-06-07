import { Component, Injector, Input, OnInit } from '@angular/core';
import { WidgetDataService } from 'src/app/lib/oa/core/services';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';


@Component({
  selector: 'insight-login-activity',
  templateUrl: './login-activity.component.html',
  styleUrls: ['./login-activity.component.css']
})
export class LoginActivityComponent extends InsightWidgetBaseComponent {
  constructor(injector: Injector) {
    super(injector);
    this.code = this.code || 'user-login';
  }
}
