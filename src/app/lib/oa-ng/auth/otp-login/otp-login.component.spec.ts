import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OtpLoginComponent } from './otp-login.component';

describe('OtpLoginComponent', () => {
  let component: OtpLoginComponent;
  let fixture: ComponentFixture<OtpLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
