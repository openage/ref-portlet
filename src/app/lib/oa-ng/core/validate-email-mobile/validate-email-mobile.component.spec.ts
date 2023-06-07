import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateEmailMobileComponent } from './validate-email-mobile.component';

describe('ValidateEmailMobileComponent', () => {
  let component: ValidateEmailMobileComponent;
  let fixture: ComponentFixture<ValidateEmailMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateEmailMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateEmailMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
