import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReleaseSummaryComponent } from './release-summary.component';

describe('ReleaseSummaryComponent', () => {
  let component: ReleaseSummaryComponent;
  let fixture: ComponentFixture<ReleaseSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
