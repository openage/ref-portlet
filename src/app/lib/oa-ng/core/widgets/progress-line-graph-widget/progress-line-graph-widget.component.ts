import { Component, Injector, Input, OnChanges, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { UxService } from 'src/app/core/services';
import { RoleService, WidgetDataService } from 'src/app/lib/oa/core/services';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';



@Component({
  selector: 'insight-progress-line-graph-widget',
  templateUrl: './progress-line-graph-widget.component.html',
  styleUrls: ['./progress-line-graph-widget.component.css']
})
export class ProgressLineGraphWidgetComponent extends InsightWidgetBaseComponent implements OnInit, OnChanges {
  @Input()
  type: any;

  chart: any;

  data = {
    labels: [],
    datasets: [],
  };

  yAxes = [];

  dropDown = {
    labels: [],
    datasets: [],
  };

  yAxisLabel = '';
  xAxisLabel = '';

  constructor(injector: Injector) {
    super(injector);
    this.afterProcessing = () => {
      this.basicChart();
    };
  }

  basicChart() {
    const dataSets = [];
    const headArray = [];
    const itemHeadArray = [];
    const dataset = {
      dataArray: [],
      colorArray: [],
      borderColorArray: [],
      yAxisID: 'A',
    };
    const first = this.fields[0].key;
    this.items.forEach((item) => {
      headArray.push(item[first]);
    });
    this.fields.forEach((column) => {
      if (column.key !== first) {
        itemHeadArray.push(column);
      }
    });
    itemHeadArray.forEach((column) => {
      dataset.dataArray = [];
      dataset.colorArray = [];
      dataset.borderColorArray = [];
      dataset.yAxisID = 'A';
      this.items.forEach((item, index) => {
        dataset.dataArray.push(item[column.key]);
        if (column.style) {
          if (column.style.background) {
            dataset.colorArray.push(column.style.background);
          }
          if (column.style.border && column.style.border.color) {
            dataset.borderColorArray.push(column.style.border.color);
          }
        }
      });

      const pointRadius = [];

      this.items.forEach((item, index) => {
        if (this.items.length - 1 === index) {
          pointRadius.push(5);
        } else {
          pointRadius.push(0);
        }
      });

      dataSets.push({
        label: column.label,
        data: dataset.dataArray,
        yAxisID: dataset.yAxisID,
        backgroundColor: dataset.colorArray,
        pointRadius,
        pointHoverRadius: 5,
        fill: false,
        borderColor:
          dataset.borderColorArray && dataset.borderColorArray.length
            ? dataset.borderColorArray.shift()
            : 'rgba(255, 255, 255,1)',
        borderWidth: 2,
      });
    });

    headArray.push('');

    this.data = {
      labels: headArray,
      datasets: dataSets,
    };

    let lineMaxValue = Math.round(Math.max(...dataset.dataArray));
    lineMaxValue = lineMaxValue + 250;

    let lineMinValue = Math.round(Math.min(...dataset.dataArray));
    lineMinValue = lineMinValue - 250;

    this.yAxes = [
      {
        id: 'A',
        type: 'linear',
        position: 'left',
        ticks: {
          display: false,
          min: lineMinValue,
          max: lineMaxValue
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        scaleLabel: {
          display: false,
          labelString: this.yAxisLabel
        }
      },
    ];

    if (
      !this.isProcessing
    ) {
      let ctx;
      const htmlElement = document.getElementById(this.canvasId);
      htmlElement.style.height = (this.options as any).canvasHeight || '180px';
      htmlElement.style.width = (this.options as any).canvasWidth || 'auto';
      if (htmlElement) {
        ctx = (htmlElement as HTMLCanvasElement).getContext('2d');

        if (this.chart !== undefined) {
          this.chart.destroy();
        }
        this.chart = new Chart(ctx, {
          type: this.type,
          data: this.data,
          options: {
            responsive: true,
            // maintainAspectRatio: false,
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) => {
                  const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                  let stringValue = value.toString();
                  const splitValue = stringValue.split(/(?=(?:...)*$)/);
                  stringValue = splitValue.join(',');
                  return stringValue;
                }
              }
            },
            legend: {
              display: false,
            },
            scales: {
              yAxes: this.yAxes,
              xAxes: [
                {
                  ticks: {
                    display: false,
                  },
                  gridLines: {
                    display: false,
                    drawBorder: false,
                  },
                  scaleLabel: {
                    display: false,
                    labelString: this.xAxisLabel
                  }
                },
              ],
            },
          },
        });
      }
    }
  }
}
