import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from 'src/app/lib/oa/core/services';
import { UserService } from 'src/app/lib/oa/directory/services';

@Component({
  selector: 'app-training-help-dialog',
  templateUrl: './training-help-dialog.component.html',
  styleUrls: ['./training-help-dialog.component.css']
})
export class TrainingHelpDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TrainingHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: RoleService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  dontShow() {
    const currentUser = this.auth.currentUser();
    currentUser.meta = currentUser.meta || {};
    currentUser.meta.dontShowHelp = true;
    this.userService.update('my', { meta: currentUser.meta }).subscribe(() => {
      this.auth.setUser(currentUser);
      this.dialogRef.close();
    });
  }

  openInTab() {
    this.dialogRef.close();
    window.open('https://youtu.be/yD8iIS1-jo4', '_blank');
  }

}
