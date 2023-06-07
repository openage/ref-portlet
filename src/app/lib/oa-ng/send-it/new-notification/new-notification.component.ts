import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { NavService } from 'src/app/core/services';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Message } from 'src/app/lib/oa/send-it/models';
import { UxService } from 'src/app/core/services/ux.service';
import { InboxBaseComponent } from 'src/app/lib/oa/send-it/components/inbox.base.component';
import { NotificationDetailComponent } from '../notification-detail/notification-detail.component';

@Component({
  selector: 'send-it-new-notification',
  templateUrl: './new-notification.component.html',
  styleUrls: ['./new-notification.component.css']
})
export class NewNotificationComponent extends InboxBaseComponent implements OnInit {

  showNotifications: boolean;

  display: 'showMin' | 'showMax' = 'showMin';

  messages: Message[] = [];

  constructor(
    public dialog: MatDialog,
    public navService: NavService,
    messageService: MessageService,
    uxService: UxService,
    auth: RoleService
  ) {
    super(messageService, uxService, auth);
    this.countOnly = true;
  }

  ngOnInit() {
    super.ngOnInit();
    this.refresh(false);
    this.fetched.subscribe((data) => {
      if (data.items.length) {
        this.messages = data.items;
      } else if (!data.items.length && !data.total) {
        this.messages = [];
      }
    })
  }

  openNotifications() {
    this.showNotifications = !this.showNotifications;
    this.display = 'showMin';

    if (this.showNotifications) {
      this.refresh(false);
    }
  }


  injectBody(elementId, body) {
    const el = document.getElementById(elementId);
    // el.style.marginBottom = "0px";
    el.innerHTML = body;
  }

  open(item) {
    this.showNotifications = !this.showNotifications;
    const dialogRef = this.dialog.open(NotificationDetailComponent, {
      minWidth: '530px',
      maxWidth: '820px'
    });

    const instance = dialogRef.componentInstance;
    instance.message = item;

    this.onView(item);
  }

  onShow() {
    this.showNotifications = !this.showNotifications;
    this.navService.goto(['/home/inbox']);
  }
  onMarkAll(items) {
    this.onViewAll(items);
    this.showNotifications = !this.showNotifications;
  }

  onToggleChange(event: MatSlideToggleChange) {

  }
}
