import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateOtpInlineComponent } from './validate-otp-inline.component';

describe('ValidateOtpInlineComponent', () => {
  let component: ValidateOtpInlineComponent;
  let fixture: ComponentFixture<ValidateOtpInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateOtpInlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateOtpInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
