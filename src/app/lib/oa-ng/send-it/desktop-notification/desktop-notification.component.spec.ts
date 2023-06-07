import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopNotificationComponent } from './desktop-notification.component';

describe('DesktopNotificationComponent', () => {
  let component: DesktopNotificationComponent;
  let fixture: ComponentFixture<DesktopNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
