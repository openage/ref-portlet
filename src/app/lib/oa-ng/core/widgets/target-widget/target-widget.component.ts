import { Component, Injector, OnInit } from '@angular/core';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';


@Component({
  selector: 'insight-target-widget',
  templateUrl: './target-widget.component.html',
  styleUrls: ['./target-widget.component.css']
})
export class TargetWidgetComponent extends InsightWidgetBaseComponent {

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

  getVariance(item: any) {

    if (!item) {
      return '';
    }

    if (item && item.variance) {
      return `${item.variance} %`;
    }

    if (!item.target || !item.achieved) {
      return;
    }

    return `${Math.ceil(((item.target - item.achieved) / item.target) * 100)} %`;

  }

}
