import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PasswordLoginComponent } from './password-login.component';

describe('PasswordLoginComponent', () => {
  let component: PasswordLoginComponent;
  let fixture: ComponentFixture<PasswordLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
