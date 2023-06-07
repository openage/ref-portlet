import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { Entity } from 'src/app/lib/oa/core/models/entity.model';
import { RoleService } from 'src/app/lib/oa/core/services/role.service';
import { MessageComposerDialogComponent } from '../message-composer-dialog/message-composer-dialog.component';

@Component({
  selector: 'send-it-message-button',
  templateUrl: './send-it-message-button.component.html',
  styleUrls: ['./send-it-message-button.component.css']
})
export class SendItMessageButtonComponent implements OnInit {
  @Input()
  template: TemplateRef<any>;

  @Input()
  data: any;

  constructor(
    public dialog: MatDialog,
    private uxService: UxService,
    private roleService: RoleService
  ) {

  }

  ngOnInit(): void {
  }


  sendEmail(template, data) {
    if (data.email) {
      const dialogRef = this.dialog.open(MessageComposerDialogComponent, {
        width: '800px'
      });
      dialogRef.componentInstance.to = [data.email];
      dialogRef.componentInstance.entity = new Entity({
        id: this.roleService.currentUser().email
      });
      dialogRef.componentInstance.modes = { sms: false, email: true, push: false, chat: false };
      dialogRef.componentInstance.template = template;
      dialogRef.componentInstance.data = data
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.id) {
          this.uxService.showInfo('Email sent successfully')
        }
      });
    }
  }

}
