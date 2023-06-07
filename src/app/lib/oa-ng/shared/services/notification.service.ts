import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UxService } from 'src/app/core/services';
import { Message } from 'src/app/lib/oa/send-it/models';
import { PushNotification } from "../models/notification.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private permission: 'denied' | 'granted' | 'default';

  private cachedNotification: string;

  onViewMessage: EventEmitter<Message> = new EventEmitter<Message>();

  constructor(
    private uxService: UxService
  ) { }

  checkPermission() {
    if ('Notification' in window) {
      Notification.requestPermission((status) => {
        this.permission = status;
        if (this.permission !== 'granted') {
          return this.uxService.showInfo('Please allow notification permissions!');
        }
      });
    }
  }

  private create(title: string, options?: PushNotification): Observable<any> {
    this.checkPermission()
    return new Observable((notify) => {
      let notification = new Notification(title, options);
      notification.onshow = (event) => {
        return notify.next({
          notification: notification,
          event: event
        });
      };
      notification.onclick = (event) => {
        return notify.next({
          notification: notification,
          event: event
        });
      };
      notification.onerror = (event) => {
        return notify.error({
          notification: notification,
          event: event
        });
      };
      notification.onclose = () => {
        return notify.complete();
      };
    });
  }

  public generateNotification(messages: Message[]): void {
    if (this.cachedNotification === JSON.stringify(messages)) {
      return;
    }
    this.cachedNotification = JSON.stringify(messages);
    messages.forEach((message) => {
      let options = new PushNotification({});
      options.icon = "../../../assets/images/notification.png";
      options.body = message.subject;
      options.data = message;
      this.create('New message from Freight Tracker!', options).subscribe((event) => {
        if (event.event.type === 'click') {
          this.onViewMessage.emit(event.notification.data);
        }
      }, () => { });
    })
  }

}
