import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReleaseTimelineComponent } from './release-timeline.component';

describe('ReleaseTimelineComponent', () => {
  let component: ReleaseTimelineComponent;
  let fixture: ComponentFixture<ReleaseTimelineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
