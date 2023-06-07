import { Component, Injector, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { UxService } from 'src/app/core/services';
import { RoleService, WidgetDataService } from 'src/app/lib/oa/core/services';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';


@Component({
  selector: 'insight-graph-widget',
  templateUrl: './graph-widget.component.html',
  styleUrls: ['./graph-widget.component.css']
})
export class GraphWidgetComponent extends InsightWidgetBaseComponent {

  data = {
    labels: [],
    datasets: []
  };

  yAxes = [];

  chart: any;

  constructor(injector: Injector) {
    super(injector);

    this.afterProcessing = () => {
      const datasets = [];
      let options;

      const headArray = this.fields.map((c) => c.key);
      this.items.forEach((item) => {
        const dataset = {
          dataArray: [],
          colorArray: [],
          borderColorArray: []
        };
        this.fields.forEach((column) => {
          dataset.dataArray.push(parseInt(item[column.key]));
          if (column.style) {
            if (column.style.background) {
              dataset.colorArray.push(column.style.background);
            }
            if (column.style.border && column.style.border.color) {
              dataset.borderColorArray.push(column.style.border.color);
            }
          }
        });
        datasets.push({
          label: this.code,
          data: dataset.dataArray,
          backgroundColor: dataset.colorArray,
          borderColor: dataset.borderColorArray,
          borderWidth: 1
        });
      });

      this.data = {
        labels: headArray,
        datasets
      };

      options = {
        scales: {
          xAxes: [{
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              display: false,
            }
          }],
          yAxes: [
            {
              id: 'A',
              type: 'linear',
              position: 'left',
              ticks: {
                beginAtZero: true,
                callback: (item, index, values) => {
                  item = item.toString();
                  item = item.split(/(?=(?:...)*$)/);
                  item = item.join(',');
                  return item;
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Hlo'
              }
            }]
        }
      };

      if (!this.isProcessing && this.data.labels.length > 0 && this.data.datasets.length > 0) {
        let ctx;
        const htmlElement = document.getElementById(this.canvasId);
        htmlElement.style.height = (this.options as any).canvasHeight || '300px';
        htmlElement.style.width = (this.options as any).canvasWidth || '411px';
        if (htmlElement) {
          ctx = (htmlElement as HTMLCanvasElement).getContext('2d');
          this.chart = new Chart(ctx, {
            type: this.config.type,
            data: this.data,
            options
          });
        }
      }
    };
  }

}
