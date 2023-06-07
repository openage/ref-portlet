import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavService } from 'src/app/core/services';
import { ErrorModel } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  /**
   *  error levels
   * - info - requires data correction
   * - warn - requires data correction
   * - error - requires reload
  */

  private errors: any = {};

  constructor(
    private http: HttpClient,
    private auth: RoleService,
    private navService: NavService
  ) {
    this.http.get('assets/data/errors.json', { responseType: 'text' })
      .subscribe((data) => {
        this.errors = {};
        JSON.parse(data).items.forEach((item) => {
          this.errors[item.code] = item.ref ? this.errors[item.ref] : item;
        });
      });
  }

  get(error: any): ErrorModel {

    if (!error) { return }

    const key = error.code || error.message || error;

    let item = this.errors[key];

    if (!item) {
      item = {
        code: key,
        level: 'fatal',
        title: error.name || error.message || 'Error',
        description: error.message || error.code || error,
        actions: [{
          code: 'reload',
          title: 'Reload',
          type: 'primary'
        }]
      };
    }

    for (const action of item.actions) {

      if (!action.code || action.event) {
        continue;
      }

      switch (action.code) {
        case 'reload':
          action.event = () => document.location.reload();
          break;
        case 'logout':
          action.event = () => this.auth.logout();
          break;

        case 'notify-admin':
          action.event = () => {
            console.log('implement notification');
          };
        case 'navigate':
          if (action.value && typeof action.value === 'string') {
            action.value = action.value.replace(':code', error.meta[error.meta.entity].code)
          }
          if (action.config && typeof action.config === 'string') {
            action.config = action.config.replace(':code', error.meta[error.meta.entity].code)
          }
          action.event = (value) => this.navService.goto(value);
          break;
      }
    }

    return new ErrorModel(item);
  }

}
