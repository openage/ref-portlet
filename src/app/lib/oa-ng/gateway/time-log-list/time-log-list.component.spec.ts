import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeLogListComponent } from './time-log-list.component';

describe('TimeLogListComponent', () => {
  let component: TimeLogListComponent;
  let fixture: ComponentFixture<TimeLogListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimeLogListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
