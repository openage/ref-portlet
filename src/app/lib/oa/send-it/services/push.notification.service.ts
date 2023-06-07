import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from './../models/message.model';

@Injectable()
export class PushNotificationsService {

  public permission: Permission;

  constructor(router: Router) {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }
  public isSupported(): boolean {
    return 'Notification' in window;
  }
  requestPermission(): void {
    const self = this;
    if ('Notification' in window) {
      Notification.requestPermission((status) => {
        return self.permission = status;
      });
    }
  }
  create(title: string, options?: IPushNotification): any {
    const self = this;
    return new Observable((obs) => {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log('The user hasn\'t granted you permission to send push notifications');
        obs.complete();
      }
      const _notify = new Notification(title, options);
      _notify.onshow = (e) => {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onclick = (e) => {
        return obs.next({
          notification: _notify,
          event: e
        });
      };
      _notify.onerror = (e) => {
        return obs.error({
          notification: _notify,
          event: e
        });
      };
      _notify.onclose = () => {
        return obs.complete();
      };
    });
  }
  generateNotification(source: any): void {
    const self = this;
    const options = {
      body: source.notification.body,
      icon: 'src/favicon.ico'
    };
    self.create(source.notification.title, options).subscribe();
  }
}
export declare type Permission = 'denied' | 'granted' | 'default';
export interface IPushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}
