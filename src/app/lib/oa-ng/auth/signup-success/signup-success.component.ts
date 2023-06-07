import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { UxService, ValidationService } from 'src/app/core/services';
import { ErrorModel, Pic } from 'src/app/lib/oa/core/models';
import { RoleService } from 'src/app/lib/oa/core/services';
import { User } from 'src/app/lib/oa/directory/models';
import { UserService } from 'src/app/lib/oa/directory/services';
import { ThumbnailSelectorComponent } from '../../drive/thumbnail-selector/thumbnail-selector.component';

@Component({
  selector: 'auth-signup-success',
  templateUrl: './signup-success.component.html',
  styleUrls: ['./signup-success.component.css']
})

export class SignupSuccessComponent implements OnInit {

  @Input()
  userId: string;

  @Output()
  success: EventEmitter<User> = new EventEmitter();

  @Output()
  processing: EventEmitter<boolean> = new EventEmitter();

  user: User = new User({ profile: {} });

  password: string = null;

  confirmPassword: string = null;

  error: ErrorModel;

  isProcessing: boolean;


  isInvalidPassword: boolean;

  constructor(
    private userService: UserService,
    private auth: RoleService,
    private uxService: UxService,
    public dialog: MatDialog,
    public validationService: ValidationService,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    // if (this.auth.currentRole() && this.auth.currentRole().email) {
    //   this.user.email = this.auth.currentRole().email;
    // }
  }

  openThumbnailSelector() {
    const dialogRef = this.dialog.open(ThumbnailSelectorComponent, {
      width: '500px',
    });

    dialogRef.componentInstance.cropRatio = 1 / 1;
    dialogRef.componentInstance.okLabel = 'OK';
    dialogRef.componentInstance.dialogTitle = 'Select Image';

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.user.profile.pic = new Pic({ url: result });
      }
    });
  }

  checkPhoneOrEmail = (value: string): Observable<string | null> => {
    const subject = new Subject<string | null>();
    this.roleService.exists(`${value}`).subscribe((result) => {
      if (result.exists) { subject.next('already exist'); } else { subject.next(null); }
    });
    return subject.asObservable();
  }

  isConfirmPasswordValid(value) {
    if (this.password !== value) {
      return 'PASSWORD_DNM'
    };
  }

  updateUser() {
    if (this.password !== this.confirmPassword) {
      return this.uxService.handleError('Password does not match');
    }
    if (!this.user.profile.firstName || !this.user.profile.lastName) {
      return this.uxService.handleError('Name required');
    }
    if (!this.user.phone) {
      return this.uxService.handleError('Mobile number required');
    }
    if (!this.user.email) {
      return this.uxService.handleError('Email address required');
    }

    this.isProcessing = true;
    this.processing.emit(true);
    this.user['password'] = this.password;
    this.userService.update('my', this.user).subscribe((item) => {
      let currentUser = this.auth.currentUser();
      currentUser = Object.assign(currentUser, item);
      this.auth.setUser(currentUser);
      this.success.emit(item);
      this.isProcessing = false;
      this.processing.emit(false);
    }, (err) => {
      this.isProcessing = false;
      this.processing.emit(false);
      this.uxService.handleError(err);
    });
  }

}
