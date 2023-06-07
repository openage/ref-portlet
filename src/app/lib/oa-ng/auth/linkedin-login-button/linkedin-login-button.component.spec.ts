import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LinkedinLoginButtonComponent } from './linkedin-login-button.component';

describe('LinkedinLoginButtonComponent', () => {
  let component: LinkedinLoginButtonComponent;
  let fixture: ComponentFixture<LinkedinLoginButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedinLoginButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
