export class TemplateConfig {
  page?: {
    orientation: string,
    border: {
      left?: number,
      bottom?: number,
      right?: number,
      top?: number
    };
    width?: number,
    height?: number
  };

  modes?: {
    sms: boolean,
    email: boolean,
    push: boolean
  };
  to?: {
    field?: string
  };

  entity?: {
    name: string,
    type: string,
    id: string
  };

  constructor(obj?: any) {

    if (!obj) {
      return;
    }

    if (obj.page) {
      this.page = {
        orientation: obj.page.orientation,
        width: obj.page.width,
        height: obj.page.height,
        border: {}
      };

      if (obj.page.border) {
        this.page.border.left = obj.page.border.left;
        this.page.border.right = obj.page.border.right;
        this.page.border.top = obj.page.border.top;
        this.page.border.bottom = obj.page.border.bottom;

      }
    }

    if (obj.to) {
      this.to = obj.to;
    }

    if (obj.modes) {
      this.modes = obj.modes;
    }

    if (obj.entity) {
      this.entity = obj.entity;
    }
  }
}
