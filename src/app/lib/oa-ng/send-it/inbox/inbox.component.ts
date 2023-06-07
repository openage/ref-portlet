import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/lib/oa/send-it/services';
import { NavService } from 'src/app/core/services/nav.service';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { UxService } from 'src/app/core/services/ux.service';
import { InboxBaseComponent } from 'src/app/lib/oa/send-it/components/inbox.base.component';
import { NotificationDetailComponent } from '../notification-detail/notification-detail.component';

@Component({
  selector: 'send-it-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css'],
})
export class InboxComponent extends InboxBaseComponent {
  @Output() code: EventEmitter<any> = new EventEmitter();

  constructor(
    service: MessageService,
    uxService: UxService,
    public navService: NavService,
    public dialog: MatDialog,
    auth: RoleService
  ) {
    super(service, uxService, auth);
  }
  viewAll() {
    this.navService.goto('/home/inbox')
  }

  open(item) {
    const dialogRef = this.dialog.open(NotificationDetailComponent, {
      minWidth: '530px',
      maxWidth: '820px',
    });

    const instance = dialogRef.componentInstance;
    instance.message = item;

    this.onView(item);
    this.code = item;
  }
  onStatusChange(item, status) {
    item.status = status;
    this.update(item);
  }
}
