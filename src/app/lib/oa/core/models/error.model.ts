import { Action } from '../structures/menu/action.model';
import { GeoLocation } from './geo-location.model';

export class ErrorModel extends Error {
  code: string;
  icon: string;
  title: string;
  description: string;
  level: 'error' | 'warn' | 'info';
  timer: number;
  actions: Action[];
  view: 'dialog' | 'banner' | 'subtle';

  constructor(obj?: any) {

    super();

    if (!obj) {
      return;
    }

    this.code = obj.code;
    this.icon = obj.icon;
    this.title = obj.title || obj.name;
    this.name = this.title;
    this.description = obj.description || obj.message;
    this.message = this.description;
    this.timer = obj.duration || 0;
    this.level = obj.level || 'warn';
    this.view = obj.view || 'subtle';
    this.actions = (obj.actions || []).map(a => new Action(a));
  }
}
