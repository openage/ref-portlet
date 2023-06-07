import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CalenderDayDetailComponent } from './calender-day-detail.component';

describe('CalenderDayDetailComponent', () => {
  let component: CalenderDayDetailComponent;
  let fixture: ComponentFixture<CalenderDayDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CalenderDayDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderDayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
