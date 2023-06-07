import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CalendarDateComponent } from './calendar-date.component';

describe('CalendarDateComponent', () => {
  let component: CalendarDateComponent;
  let fixture: ComponentFixture<CalendarDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarDateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
