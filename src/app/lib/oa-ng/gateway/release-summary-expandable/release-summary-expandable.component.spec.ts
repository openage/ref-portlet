import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReleaseSummaryExpandableComponent } from './release-summary-expandable.component';

describe('ReleaseSummaryExpandableComponent', () => {
  let component: ReleaseSummaryExpandableComponent;
  let fixture: ComponentFixture<ReleaseSummaryExpandableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseSummaryExpandableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseSummaryExpandableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
