import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoogleLoginButtonComponent } from './google-login-button.component';

describe('GoogleLoginButtonComponent', () => {
  let component: GoogleLoginButtonComponent;
  let fixture: ComponentFixture<GoogleLoginButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleLoginButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
