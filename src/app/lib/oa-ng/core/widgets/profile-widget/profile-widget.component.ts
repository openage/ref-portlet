import { Component, Injector, OnInit } from '@angular/core';
import { UxService } from 'src/app/core/services/ux.service';
import { WidgetDataService } from 'src/app/lib/oa/core/services';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';

@Component({
  selector: 'insight-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.css']
})
export class ProfileWidgetComponent extends InsightWidgetBaseComponent {

  constructor(injector: Injector) {
    super(injector);

    this.afterInitialization = () => {
      this.style = this.style || {
        container: {
          class: 'widget-grid'
        },
        header: {
          class: 'grid-card'
        },
        value: {
          class: 'grid-value'
        },
        title: {
          class: 'grid-title'
        }
      };

    };
  }

  ngOnInit() {
  }

}
