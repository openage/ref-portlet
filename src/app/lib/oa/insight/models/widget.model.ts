export class Widget {
  yAxisLabel: string;
  xAxisLabel: string;
  code: string;
  title: string;
  class: string;
  style: { container?: any };
  config: {
    type?: string;
    canvasWidth?: string;
    canvasHeight?: string;
    canvasId?: string;
  };

  constructor(obj?: any) {
    if (!obj) {
      return;
    }

    this.yAxisLabel = obj.yAxisLabel;
    this.xAxisLabel = obj.xAxisLabel;
    this.code = obj.code;
    this.class = obj.class;
    this.title = obj.title;
    this.style = obj.style || {};
    this.config = obj.config || {};
  }

}
