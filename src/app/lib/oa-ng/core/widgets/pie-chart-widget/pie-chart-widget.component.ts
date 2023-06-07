import { Component, Injector, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { UxService } from 'src/app/core/services';
import { RoleService, WidgetDataService } from 'src/app/lib/oa/core/services';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';


@Component({
  selector: 'insight-pie-chart-widget',
  templateUrl: './pie-chart-widget.component.html',
  styleUrls: ['./pie-chart-widget.component.css']
})
export class PieChartWidgetComponent extends InsightWidgetBaseComponent {
  chart: any;
  data = {
    labels: [],
    datasets: []
  };
  scales: {};
  constructor(injector: Injector) {
    super(injector);
    this.afterInitialization = () => {
      this.dataReceiving = true;
      if (this.chart) this.chart.destroy();
    }
    this.afterProcessing = () => {
      this.dataReceiving = false;
      let options;
      let datasets = [];
      const newItems = [{}];

      // this.items.forEach((item) => {
      //   newItems[0][item.name] = item.value;
      //  // newItems[0]['test'] = 'test';
      // });
      // this.items = newItems;

      const headArray = this.fields.map((c) => c.label);
      this.items.forEach((item) => {
        datasets = [];
        const dataset = {
          dataArray: [],
          colorArray: [],
          borderColorArray: []
        };
        this.fields.forEach((column) => {
          // eslint-disable-next-line radix
          if (!column.isHidden) {
            dataset.dataArray.push(parseInt(item[column.key]));
            if (column.style) {
              if (column.style.background) {
                dataset.colorArray.push(column.style.background);
              }
              if (column.style.border && column.style.border.color) {
                dataset.borderColorArray.push(column.style.border.color);
              }
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

      this.scales = {
        xAxes: [{
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
          }
        }],
        yAxes: [{
          gridLines: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            display: false,
          }
        }]
      };

      options = {
        // events: true,
        scales: this.scales,
        legend: {
          labels: {
            generateLabels: (chart) => {
              const { data } = chart;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const meta = chart.getDatasetMeta(0);
                  const ds = data.datasets[0];
                  const arc = meta.data[i];
                  const custom = (arc && arc.custom) || {};
                  // const { getValueAtIndexOrDefault } = Chart.helpers;
                  // const arcOpts = chart.options.elements.arc;
                  // const fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                  // const stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                  // const bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
                  var value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];
                  if (Number.isNaN(value)) {
                    value = 0;
                  }
                  return {
                    text: `${label}: ${value}`,
                    // fillStyle: fill,
                    // strokeStyle: stroke,
                    // lineWidth: bw,
                    hidden: Number.isNaN(ds.data[i]) || meta.data[i].hidden,
                    index: i,
                  };
                });
              }
              return [];
            },
            usePointStyle: true
          },
          position: 'bottom',
          display: true,
        },
        animation: {
          duration: 500,
          cutoutPercentage: 30,
          easing: 'easeOutQuart',
          onComplete() {
            const ctx = this.chart.ctx;
            // ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function (dataset) {
              for (let i = 0; i < dataset.data.length; i++) {
                const data = dataset._meta[Object.keys(dataset._meta)[0]].data[i];
                const model = data._model,
                  // total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                  mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                  start_angle = model.startAngle,
                  end_angle = model.endAngle,
                  mid_angle = start_angle + (end_angle - start_angle) / 2;

                ctx.fillStyle = '#fff';

                const x = mid_radius * Math.cos(mid_angle);
                const y = mid_radius * Math.sin(mid_angle);
                const val = dataset.data[i];

                // var percent = String(Math.round(val / total * 100)) + "%";

                if ((val !== 0) && !data.hidden && (Number.isNaN(val) === false)) {
                  ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                  // Display percent in another line, line break doesn't work for fillText
                  // ctx.fillText(percent, model.x + x, model.y + y + 15);
                }
              }
            });
          }
        }
      };

      if (!this.isProcessing && this.data.labels.length > 0 && this.data.datasets.length > 0) {
        let ctx;
        const htmlElement = document.getElementById(this.canvasId);
        if (htmlElement) {
          htmlElement.style.height = this.canvasHeight;
          htmlElement.style.width = this.canvasWidth;
          ctx = (htmlElement as HTMLCanvasElement).getContext('2d');
          if (this.chart || this.dataReceiving) this.chart.destroy();
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
