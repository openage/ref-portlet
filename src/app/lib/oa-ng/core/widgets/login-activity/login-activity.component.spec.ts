import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginActivityComponent } from './login-activity.component';

describe('LoginActivityComponent', () => {
  let component: LoginActivityComponent;
  let fixture: ComponentFixture<LoginActivityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginActivityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
