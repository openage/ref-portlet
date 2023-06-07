import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';
import { ReportListBaseComponent } from 'src/app/lib/oa/insight/components/report-list.base.component';
import { ReportService } from 'src/app/lib/oa/insight/services/report.service';
import { Entity } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { Report } from 'src/app/lib/oa/insight/models';
import { MessageComposerDialogComponent } from '../../send-it/message-composer-dialog/message-composer-dialog.component';

@Component({
  selector: 'insight-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent extends ReportListBaseComponent {
  constructor(
    private roleService: RoleService,
    public dialog: MatDialog,
    api: ReportService,
    errorHandler: UxService
  ) {
    super(api, errorHandler);
  }

  sendEmail(report: Report) {
    const items = report.url.split('/');

    const dialogRef = this.dialog.open(MessageComposerDialogComponent, {
      width: '800px'
    });
    dialogRef.componentInstance.to = [];

    dialogRef.componentInstance.attachments = [{
      filename: items[items.length - 1],
      url: report.url,
      mimeType: ''
    }];
    dialogRef.componentInstance.entity = new Entity({
      id: this.roleService.currentUser().email,
      type: 'report'
    });
    dialogRef.componentInstance.modes = { sms: false, email: true, push: false, chat: false };

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.code) { }
    });
  }
}
