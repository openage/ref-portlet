import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivitySummaryComponent } from './activity-summary.component';

describe('SerActivitySummaryComponent', () => {
  let component: ActivitySummaryComponent;
  let fixture: ComponentFixture<ActivitySummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitySummaryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
