import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from 'src/app/lib/oa/core/structures';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  private _errors: any = {};
  private _actions: any = {};
  private _icons: any = {};

  constructor(
    private http: HttpClient
  ) {

    this.http.get('assets/data/errors.json', { responseType: 'text' })
      .subscribe((data) => {
        this._errors = {};
        JSON.parse(data).items.forEach((item) => {
          this._errors[item.code.toLowerCase()] = item.ref ? this._errors[item.ref] : item;
        });
      });

    this.http.get('assets/data/actions.json', { responseType: 'text' })
      .subscribe((data) => {
        this._actions = {};
        JSON.parse(data).items.forEach((item) => {
          this._actions[item.code.toLowerCase()] = item.ref ? this._actions[item.ref] : item;
        });
      });

    this.http.get('assets/data/icons.json', { responseType: 'text' })
      .subscribe((data) => {
        this._icons = {};
        JSON.parse(data).items.forEach((item) => {
          this._icons[item.code.toLowerCase()] = item.ref ? this._icons[item.ref] : item;
        });
      });
  }

  errors = {
    get: (code) => {
      if (!code) return;
      return this._errors[code.toLowerCase()];
    }
  }

  actions = {
    get: (item) => {
      if (!item) return;

      if (typeof item === 'string') {
        item = new Action({ code: item })
      } else if (!(item instanceof Action)) {
        item = new Action(item);
      }

      const code = item.code.toLowerCase();

      let action = this._actions[code];
      const icon = this._icons[code]

      if (icon) {
        if (action) {
          action.icon = action.icon || icon;
          action.title = action.title || icon.title;
        } else {
          action = {
            title: icon.title,
            icon: icon
          }
        }
      }

      if (action) {
        item.title = item.title || action.title || action.label;
        item.icon = item.icon || action.icon;
        item.type = item.type || action.type;
        item.value = item.value || action.value;
        item.display = item.display || action.display;
        item.options = item.options || action.options;
        item.permissions = item.permissions || action.permissions;
        item.handler = item.handler || action.handler;
        item.provider = item.provider || action.provider;
        item.config = item.config || action.config;

        if (item.isDisabled !== undefined) {
          item.isDisabled = action.isDisabled;
        }

        if (item.isCancelled !== undefined) {
          item.isCancelled = action.isCancelled;
        }

        if (item.isSkipActionOnList !== undefined) {
          item.isSkipActionOnList = action.isSkipActionOnList;
        }

        if (item.isAuto !== undefined) {
          item.isAuto = action.isAuto;
        }
      }

      item.icon = item.icon || item.code;

      return item
    }
  }

  icons = {
    get: (code) => {
      if (!code) return;
      return this._icons[code];
    }
  }
}
