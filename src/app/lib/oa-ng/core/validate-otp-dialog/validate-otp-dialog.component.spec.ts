import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateOtpDialogComponent } from './validate-otp-dialog.component';

describe('ValidateOtpDialogComponent', () => {
  let component: ValidateOtpDialogComponent;
  let fixture: ComponentFixture<ValidateOtpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateOtpDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateOtpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
