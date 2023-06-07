import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileWidgetComponent } from './profile-widget.component';

describe('ProfileWidgetComponent', () => {
  let component: ProfileWidgetComponent;
  let fixture: ComponentFixture<ProfileWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileWidgetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
