import { Component, Injector } from '@angular/core';
import * as d3 from 'd3';
import { UxService } from 'src/app/core/services';
import { RoleService, WidgetDataService } from 'src/app/lib/oa/core/services';
import { InsightWidgetBaseComponent } from '../insight-widget.base.component';

@Component({
  selector: 'insight-bubble-graph-widget',
  templateUrl: './bubble-widget.component.html',
  styleUrls: ['./bubble-widget.component.css']
})

export class BubbleWidgetComponent extends InsightWidgetBaseComponent {

  dataset = { children: [] };

  constructor(injector: Injector) {
    super(injector);
    this.afterProcessing = () => {
      this.items.forEach((item) => {
        this.dataset.children.push({ name: `${item.group}`, count: `${item.percentage}` });
      });
      this.renderChart();
    };
  }

  renderChart() {
    const diameter = 600;
    const height = 200;
    const width = 300;
    const width2 = 200;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const bubble = d3.pack()
      .size([width, height])
      .padding(1.5);

    const svg = d3.select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'bubble');

    const nodes = d3.hierarchy(this.dataset)
      .sum(function (d: any) {
        return d.count;
      });

    const node = svg.selectAll('.node')
      .data(bubble(nodes).descendants())
      .enter()
      .filter(function (d) {
        return !d.children;
      })
      .append('g')
      .attr('class', 'node')
      .attr('transform', function (d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      }).style('fill', function (d, i: any) {
        return color(i);
      });

    node.append('title')
      .text(function (d: any) {
        return d.data.name + ': ' + d.data.count;
      });

    node.append('circle')
      .attr('x', function (d) { return d.x; })
      .attr('y', function (d) { return d.y; })
      .attr('r', function (d) {
        return d.r;
      })
      .style('fill', function (d, i: any) {
        return color(i);
      });

    node.append('text')
      .attr('dy', '.2em')
      .style('text-anchor', 'middle')
      .text(function (d: any) {
        return d.data.name.substring(0, d.r / 3);
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', function (d) {
        return d.r / 5;
      })
      .attr('fill', 'white');

    node.append('text')
      .attr('dy', '1.3em')
      .style('text-anchor', 'middle')
      .text(function (d: any) {
        return d.data.count;
      })
      .attr('font-family', 'Gill Sans')
      .attr('font-size', function (d) {
        return d.r / 5;
      })
      .attr('fill', 'white');

    // d3.select(self.frameElement)
    //   .style("height", height + "px")
    //   .style("width", width2 + "px");;

  }

}
