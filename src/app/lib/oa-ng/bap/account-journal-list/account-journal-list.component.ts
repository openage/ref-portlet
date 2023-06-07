import { Component, ErrorHandler, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { AccountJournalListBaseComponent } from 'src/app/lib/oa/bap/components/account-journal-list-base.component';
import { JournalService } from 'src/app/lib/oa/bap/services/journal.service';
import { AccountJournalNewComponent } from '../account-journal-new/account-journal-new.component';

@Component({
  selector: 'bap-account-journal-list',
  templateUrl: './account-journal-list.component.html',
  styleUrls: ['./account-journal-list.component.css']
})
export class AccountJournalListComponent extends AccountJournalListBaseComponent {

  constructor(
    public api: JournalService,
    public uxService: UxService,
    private dialog: MatDialog,
  ) {
    super(api, uxService)
  }


  public addNew() {
    const dialogRef = this.dialog.open(AccountJournalNewComponent, {
      disableClose: true
    });

    dialogRef.componentInstance.account = this.account;

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.create(result);
      }
    })
  }
}
