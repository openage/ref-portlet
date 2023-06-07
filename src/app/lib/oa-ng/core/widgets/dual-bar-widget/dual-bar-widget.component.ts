import { Component, Injector, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';


@Component({
  selector: 'insight-dual-bar-widget',
  templateUrl: './dual-bar-widget.component.html',
  styleUrls: ['./dual-bar-widget.component.css']
})
export class DualBarWidgetComponent extends InsightWidgetBaseComponent {

  data = {
    labels: [],
    datasets: []
  };

  yAxes = [];

  chart: any;

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
      this.items.forEach((item) => {
        dataset.dataArray.push(item[column.key]);
        if (column.style && column.style.background) {
          dataset.colorArray.push(column.style.background);
        }
        if (column.style && column.style.border && column.style.border.color) {
          dataset.borderColorArray.push(column.style.border.color);
        }
        this.yAxes = [
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
            gridLines: {
              display: true
            }
            // scaleLabel: { // This will display label type
            //   display: true,
            //   labelString: 'hlo2'
            // }
          },
        ];

        if (column.style && column.style.yAxisID) {
          if (column.style.yAxisID === 'B') {
            this.yAxes = [
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
                gridLines: {
                  display: false,
                },
                scaleLabel: {
                  display: true,
                  labelString: itemHeadArray[0].label,
                  fontColor: itemHeadArray[0].style.background,
                  fontSize: 12.5,
                },
              },
              {
                id: 'B',
                type: 'linear',
                position: 'right',
                ticks: {
                  beginAtZero: true,
                  callback: (item, index, values) => {
                    item = item.toString();
                    item = item.split(/(?=(?:...)*$)/);
                    item = item.join(',');
                    return item;
                  }
                },
                gridLines: {
                  display: false,
                },
                scaleLabel: {
                  display: true,
                  labelString: itemHeadArray[1].label,
                  fontColor: itemHeadArray[1].style.background,
                  fontSize: 12.5,
                },
              },
            ];
          }
          dataset.yAxisID = column.style.yAxisID;
        }
      });

      dataSets.push({
        label: column.label,
        data: dataset.dataArray,
        yAxisID: dataset.yAxisID,
        backgroundColor: dataset.colorArray,
        fill: false,
        borderColor:
          dataset.borderColorArray && dataset.borderColorArray.length
            ? dataset.borderColorArray.shift()
            : 'rgba(255, 255, 255,1)',
        borderWidth: 2,
      });
    });
    this.data = {
      labels: headArray,
      datasets: dataSets,
    };

    if (!this.isProcessing) {
      let ctx;
      const htmlElement = document.getElementById(this.canvasId);
      htmlElement.style.height = (this.options as any).canvasHeight || '300px';
      htmlElement.style.width = (this.options as any).canvasWidth || '411px';
      if (htmlElement) {
        ctx = (htmlElement as HTMLCanvasElement).getContext('2d');

        if (this.chart !== undefined) {
          this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
          type: this.config.type,
          data: this.data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
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
              // labels: {
              //   boxWidth: 18,
              // },
              // onClick: null,
              // position: "left"
              display: true,
            },
            scales: {
              yAxes: this.yAxes,
              xAxes: [
                {
                  barThickness: 15,
                  stacked: false, // It will shift the graph on Y axis
                  // barPercentage: .6,
                  // categoryPercentage: 1.0,
                  // barThickness: 15,
                  ticks: {
                    display: true, // this will remove only the label
                    maxRotation: 90,
                    minRotation: 80,
                    callback: (value, index, values) => {
                      return value;
                    },
                  },
                  gridLines: {
                    display: false,
                  }
                  // scaleLabel: { // This will display label type
                  //   display: true,
                  //   labelString: 'hlo2'
                  // }
                },
              ],
            },
          },
        });
      }
    }
  }

}
