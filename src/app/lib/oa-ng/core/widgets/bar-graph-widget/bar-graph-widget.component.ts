import { Component, Injector, OnInit } from '@angular/core';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';
import { Chart } from "chart.js";

@Component({
  selector: 'insight-single-bar-widget',
  templateUrl: './bar-graph-widget.component.html',
  styleUrls: ['./bar-graph-widget.component.css']
})
export class BarGraphWidgetComponent extends InsightWidgetBaseComponent implements OnInit {
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
              if (column.style.backgroundColor) {
                dataset.colorArray.push(column.style.backgroundColor);
              }
              if (column.style.borderColor && column.style.borderColor) {
                dataset.borderColorArray.push(column.style.borderColor);
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
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      };

      options = {
        tooltips: {
          callbacks: {
            label: function (tooltipItem) {
              return Number(tooltipItem.yLabel);
            }
          }
        },
        title: {
          display: true,
          text: this.config?.displayText || "",
          position: 'bottom'
        },
        scales: this.scales,
        legend: {
          display: false
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
            type: 'bar',
            data: this.data,
            options
          });
        }
      }
    };
  }
}
