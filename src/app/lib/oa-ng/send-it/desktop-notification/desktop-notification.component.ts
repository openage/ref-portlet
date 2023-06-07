import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { PagerBaseComponent } from 'src/app/lib/oa/core/structures';
import { Message } from 'src/app/lib/oa/send-it/models';
import { MessageService } from 'src/app/lib/oa/send-it/services/message.service';
import { NotificationService } from 'src/app/lib/oa-ng/shared/services/notification.service';

@Component({
  selector: 'send-it-desktop-notification',
  templateUrl: './desktop-notification.component.html',
  styleUrls: ['./desktop-notification.component.css']
})
export class DesktopNotificationComponent extends PagerBaseComponent<Message> implements OnInit, OnDestroy {

  timeOut: any;

  timestamp: Date | string;

  autoRefreshTime = 60;

  constructor(
    api: MessageService,
    private auth: RoleService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private router: Router
  ) {
    super({
      api,
      filters: ['status', 'to', 'from', 'createdAt'],
    })
  }

  ngOnInit(): void {
    this.autoRefresh();
    this.fetched.subscribe((data) => {
      if (this.items.length) {
        this.notificationService.generateNotification(this.items);
      }
    })
    this.notificationService.onViewMessage.subscribe((message: Message) => {
      this.router.navigate([`home/inbox/${message.id}`])
    });
    this.notificationService.checkPermission()
  }

  refresh(timeStamp: Date | string) {
    this.filters.reset(false);
    this.filters.set('status', 'delivered');
    this.filters.set('to', 'my')
    this.filters.set('createdAt', timeStamp)
    this.filters.set('from', '!me');
    this.fetch();
  }

  autoRefresh() {
    this.timeOut = setInterval(() => {
      this.timestamp = localStorage.getItem('lastNotified');
      localStorage.setItem('lastNotified', new Date().toISOString());
      if (!this.timestamp) return;
      if (this.auth.currentRole() && this.auth.currentRole().key) {
        this.refresh(this.timestamp);
      }
    }, this.autoRefreshTime * 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timeOut);
  }

}
