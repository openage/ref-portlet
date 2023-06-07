import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UxService } from 'src/app/core/services/ux.service';

@Component({
  selector: 'code-dialog',
  templateUrl: './code-dialog.component.html',
  styleUrls: ['./code-dialog.component.css']
})
export class CodeDialogComponent implements OnInit {

  title = '';
  code = '';
  hint = 'Code is required';
  uxService: UxService;

  type: 'text' | 'otp' = 'text';

  otp = {
    char_1: '',
    char_2: '',
    char_3: '',
    char_4: '',
    char_5: '',
    char_6: '',
  };

  constructor(
    public dialog: MatDialogRef<CodeDialogComponent>
  ) { }

  ngOnInit() {
  }

  proceed() {
    this.dialog.close(this.code);
  }

  cancel() {
    this.dialog.close();
  }

  @HostListener('keydown.esc')
  public onEsc() {
    this.dialog.close();
  }

  @HostListener('keydown.enter')
  public onEnter() {
    if (this.type === 'text') {
      this.proceed();
    }
  }
}
