import { Action } from "src/app/lib/oa/core/structures";

export class DialogOptions {

  view: 'inline' | 'modal' | 'dropdown' | 'full' | 'bottom-sheet';
  trigger: Action;
  actions: Action[] = [];

  constructor(obj?: any) {
    obj = obj || {};

    if (obj.trigger && !(obj.trigger instanceof Action)) {
      this.trigger = new Action(obj.trigger);
    } else {
      this.trigger = obj.trigger;
    }

    if (obj.actions) {
      this.actions = (obj.actions || []).map((a => {
        if (a instanceof Action) {
          return new Action(a);
        } else {
          return a
        }
      }))
    }

    if (!this.view) { this.view = 'modal'; }
  }
}
