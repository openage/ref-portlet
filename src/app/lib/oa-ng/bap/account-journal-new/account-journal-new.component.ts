import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services';
import { Journal } from 'src/app/lib/oa/bap/models/journal.model';

@Component({
  selector: 'app-account-journal-new',
  templateUrl: './account-journal-new.component.html',
  styleUrls: ['./account-journal-new.component.css']
})
export class AccountJournalNewComponent implements OnInit {

  @Input() account: string;

  journal: Journal;

  constructor(
    private uxService: UxService,
    public dialogRef: MatDialogRef<AccountJournalNewComponent>,
  ) { }

  ngOnInit(): void {
    this.journal = new Journal({
      account: {
        code: this.account
      }
    });
  }

  validate(): boolean {
    let isValid = true;
    const errors = [];

    if (!this.account) {
      errors.push(`Account not found.`);
    }

    if (!this.journal.date) {
      errors.push(`Date is required`);
    }

    if (!this.journal.amount) {
      errors.push(`Amount is required`);
    }

    if (!this.journal.type) {
      errors.push(`Type is required`);
    }

    if (!this.journal.remarks) {
      errors.push(`Remarks are required`);
    }

    if (errors.length > 0) {
      isValid = false;
      this.uxService.showError(errors);
    }

    return isValid;
  }


  onSubmit(): void {
    if (!this.validate()) return;
    this.dialogRef.close(this.journal);
  }

}
