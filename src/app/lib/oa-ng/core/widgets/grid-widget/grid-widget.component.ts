import { Component, Injector, Input } from '@angular/core';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';

@Component({
  selector: 'insight-grid-widget',
  templateUrl: './grid-widget.component.html',
  styleUrls: ['./grid-widget.component.css']
})
export class GridWidgetComponent extends InsightWidgetBaseComponent {

  constructor(injector: Injector) {
    super(injector);
    this.view = 'grid';
    this.afterInitialization = () => {
      this.dataReceiving=true;
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
    this.afterProcessing=() => {
      this.dataReceiving=false;
    };
  }

  getTarget(field: any, index: number) {

    if (!this.items || !this.items.length) {
      return field.defaultTarget;
    }

    const item = this.items[index];

    if (!item) {
      return field.defaultTarget;
    }

    let target = item['target'];

    if (!target) {
      target = field.defaultTarget;
    }

    return target;
  }

}
